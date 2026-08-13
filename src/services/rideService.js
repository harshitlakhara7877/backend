const getFare = (vehicleType) => {
  const Fare = {
    bike: 80, 
    auto: 100,
    car: 200,
  }
  return Fare[vehicleType];
}

module.exports = {getFare,};