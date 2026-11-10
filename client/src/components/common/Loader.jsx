const Loader = ({ type = "rooms" }) => {
  if (type === "spinner") {
    return (
      <div className="flex justify-center py-10">
        <div className="w-8 h-8 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-72 bg-[#F5F8FA] dark:bg-[#111A2B] border border-[#E3E8EE] dark:border-[#1F2A3D] rounded-xl animate-pulse"
        ></div>
      ))}
    </div>
  );
};

export default Loader;
