class Shot
  attr_accessor :x, :y
  attr_accessor :dir
  attr_accessor :tank
  attr_accessor :id

  def get_data_hash(action='move')
    {'object' => 'shot',
     'action' => action,
     'id' => @id,
     'x' => @x,
     'y' => @y,
     'dir'=> @dir
    }
  end


end