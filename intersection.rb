#o1=> tank, o2 => shoot
def shoot(o1, o2)
  r1 = { :x => o1.x-24, :y => o1.y-24, :w => 48, :h => 48}
  r2 = { :x => o2.x-8, :y => o2.y-8, :w => 16, :h => 16}
  return ( (r1[:x] < r2[:x]+r2[:w]) && (r1[:x] + r1[:w] > r2[:x]) && (r1[:y] < r2[:y]+r2[:h]) && (r1[:y]+r1[:h] > r2[:y]) )
end
