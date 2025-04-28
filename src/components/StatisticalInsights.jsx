import { useState, useEffect } from "react";
import { fetchLottoDates, fetchLottoResultById } from "../api/lotteryAPI";

const StatisticalInsights = () => {
    const [lottoDates, setLottoDates] = useState([]);
    const [lottoResults, setLottoResults] = useState([]);
    const [numberStats, setNumberStats] = useState({});

    useEffect(() => {
        const loadLottoDates = async () => {
            try {
                const dates = await fetchLottoDates();
                setLottoDates(dates);
            } catch (error) {
                console.error(error);
            }
        };
        loadLottoDates();
    }, []);

    useEffect(() => {
        const loadLottoResults = async () => {
            try {
                const results = await Promise.all(
                    lottoDates.slice(1, 6).map(date => fetchLottoResultById(date.id))
                );
                setLottoResults(results);
            } catch (error) {
                console.error(error);
            }
        };

        if (lottoDates.length > 0) {
            loadLottoResults();
        }
    }, [lottoDates]);

    useEffect(() => {
        const calculateNumberStats = () => {
            const stats = {};

            lottoResults.forEach(result => {
                result.prizes.forEach(prize => {
                    prize.number.forEach(number => {
                        stats[number] = (stats[number] || 0) + 1;
                    });
                });

                result.runningNumbers.forEach(running => {
                    running.number.forEach(number => {
                        stats[number] = (stats[number] || 0) + 1;
                    });
                });
            });

            setNumberStats(stats);
        };

        if (lottoResults.length > 0) {
            calculateNumberStats();
        }
    }, [lottoResults]);

    const sortedNumbers = Object.entries(numberStats).sort((a, b) => b[1] - a[1]);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col">
                <span className="text-2xl font-bold">เลขที่ออกบ่อย</span>
                <span className="text-xs text-gray-500">5 งวดย้อนหลัง</span>
            </div>
            <ul className="list-disc ps-5">
                {sortedNumbers
                    .filter(([_, count]) => count >= 2)
                    .map(([number, count], index) => (
                        <li className="mt-3" key={index}>
                            {number}  ออก {count} ครั้ง
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default StatisticalInsights;
