function getDirection(x, y, instance, lookUp, haveBeen, steps) {
  instance.strpIndex = [
    'east', 'east', 'east',
    'south', 'south', 'south', 'south', 'south', 'south', 'south',
    'west', 'west',
    'south', 'south',
    'east',
    'south', 'south', 'south', 'south', 'south', 'south', 'south',
    'west', 'west',
    'south', 'south', 'south', 'south',
    'east', 'east','east', 'east','east', 'east',
    'south', 'south', 'south',
    'west',
    'south', 'south', 'south',
    'east','east','east',
    'south', 'south', 'south',
    'east','east','east','east',
    'south', 'south',
    'west',
    'south', 'south', 'south', 'south',
    'east','east','east','east',
    'north','north',
    'east','east','east','east','east',
    'south', 'south',
    'east','east','east', 'east','east','east',
    'north','north',
    'west',
    'north','north','north',
    'west','west',
    'north',
    'west','west',
    'south',
    'west','west',
    'north','west','north','west','north','west','north','west','north','west','north','west','north','west','north','west','north','west','north','west','north','west','north','west','north','west','north','west','north','west',
    'north','north','north',
    'east','north','east','north','east','north','east','east',
    'south','east','east','east','south',
    'east','east','east','east','east','east','east','east','east','east','east','east','east','east',
    'north','east','east','east','east','east','east',
    'south','east','south','east',
    'south','south','south','south','south',
    'west','south','west','south','west','south','west','south','south','west','west',
    'south','south','west','west',
    'south','south','south',
    'east','east','north',
    'east','east','east','north',
    'north','east','east','east','east',
    'north','north','north','north',
    'east','east','north','north','north','north','north',
    'east','north','north','north','north','north',
    'east','east','east','east','east','east',
    'south','south','south','south','south','south','south','south','south','south','south','south','south','south','south','south','south','south','south','south',
    'east','east',
    'south','south','south',
    'east',
    'south','south',
  ]
  return instance.strpIndex[steps];
}
