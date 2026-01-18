import { useState } from "react";
import RoomFilter from "./RoomFilter";
import RoomCard from "./RoomCard";

const RoomList = ({ rooms }) => {
  const [type, setType] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 6;

  /* 🔍 Filter logic */
  const filteredRooms = rooms.filter((room) => {
    const matchType = type ? room.type === type : true;
    const matchQuery = room.title
      .toLowerCase()
      .includes(query);

    return matchType && matchQuery;
  });

  /* 📄 Pagination logic */
  const start = (page - 1) * perPage;
  const paginatedRooms = filteredRooms.slice(start, start + perPage);

  return (
    <>
      {/* Filters */}
      <RoomFilter setType={setType} setQuery={setQuery} />

      {/* Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paginatedRooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>

      {/* Pagination */}
      {filteredRooms.length > perPage && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="flex items-center font-semibold">
            Page {page}
          </span>

          <button
            disabled={start + perPage >= filteredRooms.length}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default RoomList;
