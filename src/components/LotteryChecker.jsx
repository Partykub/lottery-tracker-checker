import { useState, useEffect } from "react";
import axios from "axios";

const fetchLotteryResultByDate = async (drawId) => {
  try {
    const response = await axios.get(`https://lotto.api.rayriffy.com/lotto/${drawId}`);
    return response.data.response;
  } catch (error) {
    console.error('Error fetching lottery results for specific date:', error);
    return null;
  }
};

const convertDrawDateToId = (drawDate) => {
  const [year, month, day] = drawDate.split('-');
  const buddhistYear = (parseInt(year, 10) + 543).toString();
  return `${day}${month}${buddhistYear}`;
};

const checkWinningNumber = (userNumber, lotteryData) => {
  const matchedPrizes = [];

  lotteryData.prizes.forEach((prize) => {
    prize.number.forEach((winningNumber) => {
      if (userNumber === winningNumber) {
        matchedPrizes.push({
          prizeName: prize.name,
          reward: parseInt(prize.reward, 10),
        });
      }
    });
  });

  lotteryData.runningNumbers.forEach((running) => {
    running.number.forEach((winningNumber) => {
      if (running.id === 'runningNumberBackTwo') {
        if (userNumber.slice(-2) === winningNumber) {
          matchedPrizes.push({
            prizeName: running.name,
            reward: parseInt(running.reward, 10),
          });
        }
      } else {
        if (
          userNumber.slice(0, 3) === winningNumber ||
          userNumber.slice(-3) === winningNumber
        ) {
          matchedPrizes.push({
            prizeName: running.name,
            reward: parseInt(running.reward, 10),
          });
        }
      }
    });
  });

  return matchedPrizes;
};

const LotteryChecker = () => {
  const [lotteryList, setLotteryList] = useState([]);
  const [lotteryDates, setLotteryDates] = useState([]);
  const [selectedDrawDate, setSelectedDrawDate] = useState("");
  const [checkingResults, setCheckingResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("lotteryVault")) || [];
    setLotteryList(stored);

    const uniqueDates = Array.from(new Set(stored.map((item) => item.drawDate)))
      .sort((a, b) => new Date(b) - new Date(a))
      .map((date) => ({
        id: date,
        date: date,
      }));

    setLotteryDates(uniqueDates);
  }, []);

  const filteredList = selectedDrawDate
    ? lotteryList.filter((item) => item.drawDate === selectedDrawDate)
    : [];

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  }

  const handleCheckLottery = async () => {
    if (!selectedDrawDate) return;

    setLoading(true);
    const drawId = convertDrawDateToId(selectedDrawDate);
    const lotteryData = await fetchLotteryResultByDate(drawId);

    if (!lotteryData) {
      alert('ไม่พบข้อมูลผลสลากสำหรับงวดนี้');
      setLoading(false);
      return;
    }

    const results = {};

    filteredList.forEach((entry) => {
      const matched = checkWinningNumber(entry.number, lotteryData);
      results[entry.id] = matched;
    });

    setCheckingResults(results);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">ตรวจรางวัล</h2>

      <div className="flex flex-col gap-4 mb-6">
        <select
          value={selectedDrawDate}
          onChange={(e) => {
            setSelectedDrawDate(e.target.value);
            setCheckingResults({});
          }}
          className="border p-2 rounded"
        >
          <option value="">เลือกงวดที่ต้องการ</option>
          {lotteryDates.length > 0 ? (
            lotteryDates.map((item) => (
              <option key={item.id} value={item.date}>
                {formatDate(item.date)}
              </option>
            ))
          ) : (
            <option value="">ไม่มีข้อมูลงวด</option>
          )}
        </select>

        <button
          onClick={handleCheckLottery}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded disabled:bg-gray-400"
          disabled={!selectedDrawDate || loading}
        >
          {loading ? 'กำลังตรวจ...' : 'ตรวจรางวัล'}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {filteredList.length === 0 && selectedDrawDate ? (
          <p className="text-gray-500">ยังไม่มีเลขที่บันทึกสำหรับงวดนี้</p>
        ) : (
          filteredList.map((entry) => (
            <div key={entry.id} className="border p-3 rounded">
              <p className="font-bold text-lg">{entry.number}</p>
              <p className="text-sm text-gray-500">งวด: {formatDate(entry.drawDate)}</p>

              {checkingResults[entry.id] && checkingResults[entry.id].length > 0 ? (
                <div className="mt-2 text-green-600">
                  {checkingResults[entry.id].map((prize, idx) => (
                    <div key={idx}>
                      🎊 {prize.prizeName} - {prize.reward.toLocaleString()} บาท
                    </div>
                  ))}
                </div>
              ) : checkingResults[entry.id] ? (
                <div className="mt-2 text-red-500">ไม่ถูกรางวัล</div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LotteryChecker;
