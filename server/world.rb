class World
  attr_accessor :tanks
  attr_accessor :shots
  def initialize
    @tanks = []
    @shots = []
  end

  def find_tank(id)
    ret = @tanks.select{|t| t.id == id}
    if ret.empty?
      return null
    else
      return ret.first
    end
  end

  def find_shot(id)
    ret = @shots.select{|t| t.id == id}
    if ret.empty?
      return nil
    else
      return ret.first
    end
  end


  def others(id)
    @tanks.select{|t| t.id != id}
  end

  def send_others(id,data)
    data["id"]=id
    others(id).each do |t|
      puts "Sending from: #{id} to:#{t.id} data: #{data}"
      t.socket.send data.to_json
    end
  end

  def send_all(data)
    puts "Sending to all: #{data}"
    #data["id"]=id
    @tanks.each{|t| t.socket.send data.to_json}
  end

end