const RoomFilter = ({ setType, setQuery }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search rooms by title or location..."
        className="border p-2 rounded w-full"
        onChange={(e) => setQuery(e.target.value.toLowerCase())}
      />

      {/* 🏠 BHK Filter */}
      <select
        onChange={(e) => setType(e.target.value)}
        className="border p-2 rounded w-full md:w-48"
      >
        <option value="" className="text-black">All</option>
        <option value="1BHK" className="text-black">1 BHK</option>
        <option value="2BHK" className="text-black">2 BHK</option>
        <option value="3BHK" className="text-black">3 BHK</option>
      </select>
    </div>
  );
};

export default RoomFilter;
