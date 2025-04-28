import axios from 'axios';

export const fetchLatestLotteryResults = async () => {
  try {
    const response = await axios.get('https://lotto.api.rayriffy.com/latest');
    return response.data.response;
  } catch (error) {
    console.error('Error fetching lottery results:', error);
    return null;
  }
};

export const checkWinningNumber = (userNumber, lotteryData) => {
  const matchedPrizes = [];

  // ตรวจรางวัลหลัก
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

  // ตรวจรางวัลเลขหน้า 3 ตัว / เลขท้าย 3 ตัว / เลขท้าย 2 ตัว
  lotteryData.runningNumbers.forEach((running) => {
    running.number.forEach((winningNumber) => {
      if (running.id === 'runningNumberBackTwo') {
        // รางวัลเลขท้าย 2 ตัว ตรวจแค่ 2 ตัวท้าย
        if (userNumber.slice(-2) === winningNumber) {
          matchedPrizes.push({
            prizeName: running.name,
            reward: parseInt(running.reward, 10),
          });
        }
      } else {
        // รางวัลเลขหน้า/เลขท้าย 3 ตัว ตรวจ 3 ตัวหน้า/หลัง
        if (
          userNumber.slice(0, 3) === winningNumber || // หน้า
          userNumber.slice(-3) === winningNumber      // หลัง
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

// ดึงผลสลากของงวดที่ระบุ
export const fetchLotteryResultByDate = async (drawId) => {
  try {
    const response = await axios.get(`https://lotto.api.rayriffy.com/lotto/${drawId}`);
    return response.data.response;
  } catch (error) {
    console.error('Error fetching lottery results for specific date:', error);
    return null;
  }
};

// ดึงรายการงวด
export const fetchLottoDates = async () => {
  try {
    const response = await fetch("https://lotto.api.rayriffy.com/list/1");
    const data = await response.json();
    if (data.status === "success") {
      return data.response;
    } else {
      throw new Error("Failed to fetch lotto dates");
    }
  } catch (error) {
    console.error("Error fetching lotto dates:", error);
    throw error;
  }
};

// ดึงผลหวยตาม id งวด
export const fetchLottoResultById = async (dateId) => {
  try {
    const response = await fetch(`https://lotto.api.rayriffy.com/lotto/${dateId}`);
    const data = await response.json();
    if (data.status === "success") {
      return data.response;
    } else {
      throw new Error("Failed to fetch lotto result");
    }
  } catch (error) {
    console.error("Error fetching lotto result:", error);
    throw error;
  }
};
