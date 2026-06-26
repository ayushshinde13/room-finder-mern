const Loader = ({ type = "rooms" }) => {
  if (type === "spinner") {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-48 bg-gray-300 rounded-xl"
        ></div>
      ))}
    </div>
  );
};

export default Loader;
