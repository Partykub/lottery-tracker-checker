import { useState, useEffect } from "react";

function getNextDrawDate() {
  const today = new Date();
  const day = today.getDate();
  let month = today.getMonth();
  let year = today.getFullYear();

  if (day >= 1 && day < 16) {
    return `${year}-${String(month + 1).padStart(2, "0")}-16`;
  } else {
    if (month === 11) {
      year += 1;
      month = 0;
    } else {
      month += 1;
    }
    return `${year}-${String(month + 1).padStart(2, "0")}-01`;
  }
}

const PAGE_SIZE = 2;

const LotteryVault = () => {
  const [lotteryList, setLotteryList] = useState(() => {
    const stored = localStorage.getItem("lotteryVault");
    return stored ? JSON.parse(stored) : [];
  });

  const [newNumber, setNewNumber] = useState("");
  const [drawDate, setDrawDate] = useState(getNextDrawDate());
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // To track which item is being edited
  const [editNumber, setEditNumber] = useState("");
  const [editDrawDate, setEditDrawDate] = useState("");

  useEffect(() => {
    localStorage.setItem("lotteryVault", JSON.stringify(lotteryList));
  }, [lotteryList]);

  const addNumber = () => {
    const trimmed = newNumber.trim();
    if (trimmed.length !== 6) {
      alert("กรุณากรอกเลข 6 หลักให้ครบ");
      return;
    }
    if (drawDate.trim() === "") return;

    const newEntry = {
      id: Date.now(),
      number: trimmed,
      drawDate: drawDate,
    };

    setLotteryList(prev => [newEntry, ...prev]);
    setNewNumber("");
    setDrawDate(getNextDrawDate());
    setPage(1); // Reset to page 1 after adding
  };

  const deleteNumber = (id) => {
    const updated = lotteryList.filter(entry => entry.id !== id);
    setLotteryList(updated);
  };

  const startEdit = (entry) => {
    setEditing(entry.id);
    setEditNumber(entry.number);
    setEditDrawDate(entry.drawDate);
  };

  const saveEdit = (id) => {
    const updatedList = lotteryList.map(entry =>
      entry.id === id ? { ...entry, number: editNumber, drawDate: editDrawDate } : entry
    );
    setLotteryList(updatedList);
    setEditing(null);
    setEditNumber("");
    setEditDrawDate("");
  };

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  }


  // Pagination logic
  const totalPages = Math.ceil(lotteryList.length / PAGE_SIZE);
  const paginatedList = lotteryList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">บันทึกเลขที่ซื้อ</h2>

      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          placeholder="กรอกเลข 6 หลัก"
          className="border p-2 rounded"
          value={newNumber}
          maxLength={6}
          onChange={(e) => setNewNumber(e.target.value.replace(/\D/g, ""))}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={drawDate}
          onChange={(e) => setDrawDate(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={addNumber}
        >
          บันทึกเลข
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {paginatedList.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีเลขที่บันทึก</p>
        ) : (
          paginatedList
            .sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate)) // Sort by drawDate, newest first
            .map((entry) => (
              <div key={entry.id} className="flex justify-between items-center border p-3 rounded">
                <div>
                  {editing === entry.id ? (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editNumber}
                          onChange={(e) => setEditNumber(e.target.value)}
                          maxLength={6}
                          className="border p-2 rounded w-1/4"
                        />
                        <input
                          type="date"
                          value={editDrawDate}
                          onChange={(e) => setEditDrawDate(e.target.value)}
                          className="border p-2 rounded"
                        />
                      </div>
                      <button
                        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 mt-2"
                        onClick={() => saveEdit(entry.id)}
                      >
                        บันทึกการแก้ไข
                      </button>
                    </div>

                  ) : (
                    <>
                      <p className="font-bold text-lg">{entry.number}</p>
                      <p className="text-sm text-gray-500">งวด: {formatDate(entry.drawDate)}</p>
                    </>
                  )}
                </div>
                <div>
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => startEdit(entry)}
                  >
                    แก้ไข
                  </button>
                  <button
                    className="text-red-500 hover:underline ml-2"
                    onClick={() => deleteNumber(entry.id)}
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`px-4 py-2 rounded ${page === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LotteryVault;
