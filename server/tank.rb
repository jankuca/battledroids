class Tank
  attr_accessor :socket
  attr_accessor :id
  attr_accessor :x, :y
  attr_accessor :kills
  attr_accessor :deaths
  attr_accessor :live
  attr_accessor :dir



  def initialize(socket)
    @id = socket.request["query"]["id"]
    @socket = socket
  end

  def get_data_hash(action='create')
    {'object' => 'tank',
     'action' => action,
     'id' => @id,
     'x' => @x,
     'y' => @y,
     'dir'=> @dir
    }
  end

end