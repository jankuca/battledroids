$: << "."
require 'eventmachine'
require 'em-websocket'
require 'json'


require "shot"
require "tank"
require "world"

@world = World.new;
@shoot_counter = 0;

def on_message(socket, message)
  current_id = socket.request["query"]["id"]
  puts ("receive: " + message);
  data = nil
  begin
    data = JSON.parse(message);
  rescue
    puts "JSON PARSE ERROR"
  end
  return if not data
  solve_incidence
  if data["object"] == "tank"
    case data["action"]
      when "move" then on_move(current_id, data)
    end
  end
  if data["object"] == "shot"
    case data["action"]
      when "move" then on_shoot(current_id, data)
    end
  end
end

def solve_incidence
  @world.tanks.each do |tank|
    @world.shots.each do |shot|
      if shot.tank.id != tank.id && compute_shoot(tank,shot)
        on_tank_hit(tank,shot)
      end
    end
  end
end


#o1=> tank, o2 => shoot
def compute_shoot(o1, o2)
  r1 = { :x => o1.x+24, :y => o1.y, :w => 48, :h => 48}
  r2 = { :x => o2.x, :y => o2.y, :w => 16, :h => 16}
  return ( (r1[:x] < r2[:x]+r2[:w]) && (r1[:x] + r1[:w] > r2[:x]) && (r1[:y] < r2[:y]+r2[:h]) && (r1[:y]+r1[:h] > r2[:y]) )
end

def on_move(id,data)
  data["id"]=id
  @world.send_others(id,data)
end

def on_shoot(id,data)
  tank = @world.find_tank(id)

  shot = @world.find_shot(data["id"])
  if not shot
    shot = Shot.new
    shot.tank = tank
    shot.id = data["id"]
    @world.shots << shot
  end
  shot.x = data["x"] || 0
  shot.y = data["y"] || 0
  shot.dir = data["dir"]
  if shot.x < 8 || shot.y < 8 || shot.x > 792 || shot.y > 472
    shot_obj = shot.get_data_hash('destroy')
    @world.send_all(shot_obj)
  else
    @world.send_others(id,data)
  end

end

def on_tank_hit(tank,shot)
  puts "TANK HIT!!!!!!!!!!!!!!!!!!!!!!!!!"
  tank.x = rand(800-96)+24
  tank.y = rand(480-96)+24
  tank.dir = 'right'

  tank_obj = tank.get_data_hash('move')
  shot_obj = shot.get_data_hash('destroy')

  @world.send_all(tank_obj)
  @world.send_all(shot_obj)

end


EventMachine.run do
  EventMachine::WebSocket.start(:host => '0.0.0.0', :port => 8080) do |socket|
    socket.onopen do
      p socket
      t = Tank.new(socket)
      t.x = rand(800-96)+24
      t.y = rand(480-96)+24
      t.dir = 'right'

      @world.tanks.each do |tank|
        obj = tank.get_data_hash('create')
        puts "Sending to new player: #{t.id} "
        p obj
        t.socket.send(obj.to_json)
      end

      @world.tanks << t
      obj = t.get_data_hash('create')
      @world.send_all(obj)
    end

    socket.onmessage do |mess|
      on_message(socket,mess)
    end

    socket.onclose do
      puts "CLOSE"
      p socket.request["query"]["id"]
      tank = @world.tanks.select{|t| t.id == socket.request["query"]["id"]}
      @world.tanks.delete_if{|t| t.id == socket.request["query"]["id"]}
      p tank
      p @world.tanks
      if tank.size > 0
        @world.send_all(tank.first.get_data_hash('destroy'))
      end
    end
  end
end