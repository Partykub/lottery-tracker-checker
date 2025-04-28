import { useState, useEffect } from "react";

const FavoriteNumbers = () => {
  const [favoriteNumbers, setFavoriteNumbers] = useState([]);
  const [inputNumber, setInputNumber] = useState("");
  const [lottoDates, setLottoDates] = useState([]);
  const [lottoResults, setLottoResults] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteNumbers")) || [];
    setFavoriteNumbers(storedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteNumbers", JSON.stringify(favoriteNumbers));
  }, [favoriteNumbers]);

  useEffect(() => {
    const fetchLottoDates = async () => {
      try {
        const response = await fetch("https://lotto.api.rayriffy.com/list/1");
        const data = await response.json();
        if (data.status === "success") {
          setLottoDates(data.response);
        }
      } catch (error) {
        console.error("Error fetching lotto dates:", error);
      }
    };

    fetchLottoDates();
  }, []);

  useEffect(() => {
    const fetchLottoResults = async (dateId) => {
      try {
        const response = await fetch(`https://lotto.api.rayriffy.com/lotto/${dateId}`);
        const data = await response.json();
        if (data.status === "success") {
          setLottoResults(prevResults => [...prevResults, data.response]);
        }
      } catch (error) {
        console.error("Error fetching lotto results:", error);
      }
    };

    if (lottoDates.length > 0) {
      lottoDates.slice(0, 5).forEach(date => fetchLottoResults(date.id));
    }
  }, [lottoDates]);

  const handleAddFavorite = () => {
    if (inputNumber.trim() !== "" && !favoriteNumbers.includes(inputNumber.trim())) {
      setFavoriteNumbers([...favoriteNumbers, inputNumber.trim()]);
      setInputNumber("");
    }
  };

  const handleRemoveFavorite = (numberToRemove) => {
    const updatedFavorites = favoriteNumbers.filter(number => number !== numberToRemove);
    setFavoriteNumbers(updatedFavorites);
  };

  useEffect(() => {
    const findMatches = () => {
      const foundMatches = [];

      lottoResults.forEach(result => {
        const drawDate = result.date;

        result.prizes.forEach(prize => {
          prize.number.forEach(number => {
            if (favoriteNumbers.includes(number)) {
              foundMatches.push({
                number,
                prizeName: prize.name,
                drawDate,
              });
            }
          });
        });

        result.runningNumbers.forEach(running => {
          running.number.forEach(number => {
            if (favoriteNumbers.includes(number)) {
              foundMatches.push({
                number,
                prizeName: running.name,
                drawDate,
              });
            }
          });
        });
      });

      const uniqueMatches = foundMatches.filter((match, index, self) =>
        index === self.findIndex((m) =>
          m.number === match.number && m.prizeName === match.prizeName && m.drawDate === match.drawDate
        )
      );

      setMatches(uniqueMatches);
    };


    if (favoriteNumbers.length > 0 && lottoResults.length > 0) {
      findMatches();
    } else {
      setMatches([]);
    }
  }, [favoriteNumbers, lottoResults]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-5">
      <span className="text-2xl font-bold">เลขที่ชอบ</span>
      <div className="flex gap-4">
        <input
          type="text"
          value={inputNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value) && value.length <= 6) {
              setInputNumber(value);
            }
          }}
          placeholder="กรอกเลข 6 หลัก"
          className="border p-2 rounded"
        />
        <button onClick={handleAddFavorite} className="flex-1 px-2 bg-blue-500 text-white rounded">เพิ่มเลขโปรด</button>
      </div>
      <div>
        <span className="font-bold">เลขโปรดของคุณ</span>
        {favoriteNumbers.length > 0 ? (
          <ul className="list-disc ps-5">
            {favoriteNumbers.map((number, index) => (
              <li key={index} className="items-center">
                {number}
                <button
                  onClick={() => handleRemoveFavorite(number)}
                  className="px-1 py-0.5 bg-red-500 text-white rounded ms-5"
                >
                  ลบ
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">ยังไม่มีเลขโปรด</p>
        )}
      </div>
      <div>
        <span className="font-bold">ผลการเปรียบเทียบย้อนหลัง 5 งวด</span>
        {matches.length > 0 ? (
          <ul>
            {matches.map((match, index) => (
              <li key={index}>
                เลข {match.number} ออกรางวัล "{match.prizeName}" วันที่ {match.drawDate}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">ยังไม่พบเลขโปรดที่ถูกรางวัลใน 5 งวดย้อนหลัง</p>
        )}
      </div>
    </div>
  );
};

export default FavoriteNumbers;
