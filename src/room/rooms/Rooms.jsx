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
  const [useNearby, setUseNearby] = useState(false); // ✅ 스위치 상태
  const navigate = useNavigate();

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const fetchRooms = async () => {
    try {
      const url = useNearby
        ? "http://localhost:8080/chatRoom/search/near"
        : "http://localhost:8080/chatRoom/search";

      const res = await axios.get(url, {
        params: {
          title: searchQuery,
          roomType: selectedCategory,
          page: currentPage,
          ...(useNearby
            ? {}
            : { sido: location.sido, sigungu: location.sigungu }),
        },
        withCredentials: true,
      });

      setRooms(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      alert(err.response?.data?.message || "방 불러오기 실패");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [searchQuery, selectedCategory, location, currentPage, useNearby]);

  const enterRoom = (roomId) => {
    navigate(`/room/${roomId}`);
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

      {/* 🔍 검색창 + 지역 필터 + 내 근처 스위치 */}
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

        <div className="flex gap-2 w-full md:w-auto items-center">
          {!useNearby && (
            <>
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
            </>
          )}

          {/* ✅ 내 근처 스위치 */}
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={useNearby}
              onChange={() => {
                setUseNearby((prev) => !prev);
                setCurrentPage(0);
              }}
              className="w-4 h-4"
            />
            내 근처 보기
          </label>
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
