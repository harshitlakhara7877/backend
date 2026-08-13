const { validationResult } = require("express-validator");

const Ride = require("../models/ride");
const rideService = require("../services/rideService");
const ride = require("../models/ride");

module.exports.createRide = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const existingRide = await Ride.findOne({
      user: req.user._id,
      status: {
        $in: ["pending", "accepted", "arrived", "ongoing"],
      },
    });

    if (existingRide) {
      return res.status(409).json({
        success: false,
        message: "You already have an active ride"
      })
    }

    const { pickup, destination, vehicleType } = req.body;

    const fare = rideService.getFare(vehicleType);

    const ride = await Ride.create({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
      fare,
    });

    return res.status(201).json({
      success: true,
      message: "Ride requested successfully",
      ride,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getCurrentRide = async (req, res, next) => {
  try {
    const ride = await Ride.findOne({
      user: req.user._id,
      status: {
        $in: ["pending", "accepted", "arrived", "ongoing"],
      },
    })
      .populate("captain", "name phone vehicle")
      .sort({ createdAt: -1 });

    if (!ride) {
      return res.status(200).json({
        success: true,
        message: "No active ride found",
        ride: null,
      });
    }

    return res.status(200).json({
      success: true,
      ride,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getRideHistory = async (req, res, next) => {
  try {
    const rides = await Ride.find({
      user: req.user._id,
      status: {
        $in: ["completed", "cancelled"],
      },
    })
      .populate("captain", "name phone vehicle")
      .sort({ createdAt: -1 });

    if (!rides) {
      return res.status(200).json({
        success: true,
        message: "No ride found",
        ride: null,
      });
    }

    return res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAvailableRides = async (req, res, next) => {
  try {

    const rides = await Ride.find({
      status: "pending",
      captain: null,
      vehicleType: req.captain.vehicle.vehicleType,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.acceptRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;

    const activeRide = await Ride.findOne({
      captain: req.captain._id,
      status: {
        $in: ["accepted", "arrived", "ongoing"],
      },
    });

    if (activeRide) {
      return res.status(409).json({
        success: false,
        message: "You already have an active ride",
      });
    }

    const ride = await Ride.findOneAndUpdate(
      {
        _id: rideId,
        status: "pending",
        captain: null,
        vehicleType: req.captain.vehicle.vehicleType,
      },
      {
        $set: {
          captain: req.captain._id,
          status: "accepted",
        },
      },
      {
        new: true,
      }
    )
      .populate("user", "name phone")
      .populate("captain", "name phone vehicle");

    if (!ride) {
      return res.status(409).json({
        success: false,
        message: "this ride no longer available",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Ride accepted successfully",
      ride,
    })

  } catch (err) {
    next(err);
  }
}

module.exports.updateRideStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { rideId } = req.params;
    const { status } = req.body;

    const ride = await Ride.findOne({
      _id: rideId,
      captain: req.captain._id,
    });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    const allowedTransitions = {
      accepted: "arrived",
      arrived: "ongoing",
      ongoing: "completed",
    };

    const nextStatus = allowedTransitions[ride.status];

    if (status !== nextStatus) {
      return res.status(409).json({
        success: false,
        message: `Ride cannot move from ${ride.status} to ${status}`,
      });
    }

    ride.status = status;

    if (status === "arrived") {
      ride.arrivedAt = new Date();
    }

    if (status === "ongoing") {
      ride.startedAt = new Date();
    }

    if (status === "completed") {
      ride.completedAt = new Date();
    }

    await ride.save();

    await ride.populate("user", "name phone");

    return res.status(200).json({
      success: true,
      message: `Ride status updated to ${status}`,
      ride,
    });
  } catch (error) {
    next(error);
  }
};