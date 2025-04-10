import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { locationData } from "./LocationData";
import RoomPagination from "./RoomPagination";
import RoomCard from "./RoomCard";
import RoomCategoryFilter from "../RoomCategoryFilter";
export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState({ sido: "", sigungu: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };
  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:8080/chatRoom/search", {
        params: {
          title: searchQuery,
          roomType: selectedCategory,
          page: currentPage,
          sido: location.sido,
          sigungu: location.sigungu,
        },
        withCredentials: true,
      });
      console.log(res);
      setRooms(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      alert(err.response.message);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [searchQuery, selectedCategory, location, currentPage]);

  const enterRoom = (roomId) => {
    axios
      .get(`http://localhost:8080/chatRoom/${roomId}`, {
        withCredentials: true,
      })
      .then(() => navigate(`/room/${roomId}`))
      .catch((err) => {
        console.log(err);
        alert(err.response?.data.message || "입장 중 오류 발생");
      });
  };

  const handleSidoChange = (e) => {
    setLocation({ sido: e.target.value, sigungu: "" });
    setCurrentPage(0);
  };

  const handleSigunguChange = (e) => {
    setLocation((prev) => ({ ...prev, sigungu: e.target.value }));
    setCurrentPage(0);
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 py-6">
      <RoomCategoryFilter
        selected={selectedCategory}
        onSelect={(value) => {
          setSelectedCategory(value);
          setCurrentPage(0);
        }}
      />

      {/* 🔍 검색창 + 지역 필터 */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="방 제목 검색..."
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(0);
          }}
        />

        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={location.sido}
            onChange={handleSidoChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-36"
          >
            <option value="">시/도 선택</option>
            {Object.keys(locationData).map((sido) => (
              <option key={sido} value={sido}>
                {sido}
              </option>
            ))}
          </select>

          <select
            value={location.sigungu}
            onChange={handleSigunguChange}
            disabled={!location.sido}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-36 disabled:bg-gray-100"
          >
            <option value="">시/군/구 선택</option>
            {location.sido &&
              locationData[location.sido]?.map((sigungu) => (
                <option key={sigungu} value={sigungu}>
                  {sigungu}
                </option>
              ))}
          </select>
        </div>
      </div>

      <h2 className="text-xl font-bold text-center mb-6">방 목록</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <RoomCard key={room.roomId} room={room} onClick={enterRoom} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            검색 결과가 없습니다.
          </p>
        )}
      </div>

      <RoomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
    </div>
  );
}
