let io = null;

exports.initialize = (socketIo) => {
  io = socketIo;

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // User joins their own room for receiving msgs

    socket.on("join", (userId) => {
      if (userId) {
        socket.join(userId);
      }
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
};

// Emit new msg to receiver
exports.emitNewMessage = (receiverId, messageData) => {
  if (io) {
    io.to(receiverId).emit("newMessage", messageData);
  }
};

exports.getIO = () => {
  return io;
};
