import { useState, useEffect } from "react";
import { fetchLottoDates, fetchLottoResultById, fetchLatestLotteryResults } from "../api/lotteryAPI";

const LotteryResults = () => {
    const [results, setResults] = useState(null);
    const [prizeFirst, setPrizeFirst] = useState(null);
    const [prizeFirstNear, setPrizeFirstNear] = useState(null);
    const [prizeSecond, setPrizeSecond] = useState(null);
    const [prizeThird, setPrizeThird] = useState(null);
    const [prizeForth, setPrizeForth] = useState(null);
    const [prizeFifth, setPrizeFifth] = useState(null);
    const [runningNumberFrontThree, setRunningNumberFrontThree] = useState(null);
    const [runningNumberBackThree, setRunningNumberBackThree] = useState(null);
    const [runningNumberBackTwo, setRunningNumberBackTwo] = useState(null);
    const [lotteryList, setLotteryList] = useState(null);

    useEffect(() => {
        const getResults = async () => {
            const data = await fetchLatestLotteryResults();
            setResults(data);
        };
        getResults();
    }, []);


    useEffect(() => {
        const loadLottoDates = async () => {
            try {
                const dates = await fetchLottoDates();
                console.log(dates);

                setLotteryList(dates);
                console.log(lotteryList);

            } catch (error) {
                console.error(error);
            }
        };

        loadLottoDates();
    }, []);

    useEffect(() => {
        if (!results) return;
        const getResults = () => {
            const first = results.prizes.find(prize => prize.id === 'prizeFirst');
            const firstNear = results.prizes.find(prize => prize.id === 'prizeFirstNear');
            const second = results.prizes.find(prize => prize.id === 'prizeSecond');
            const third = results.prizes.find(prize => prize.id === 'prizeThird');
            const forth = results.prizes.find(prize => prize.id === 'prizeForth');
            const fifth = results.prizes.find(prize => prize.id === 'prizeFifth');
            const frontThree = results.runningNumbers.find(runningNumbers => runningNumbers.id === 'runningNumberFrontThree');
            const backThree = results.runningNumbers.find(runningNumbers => runningNumbers.id === 'runningNumberBackThree');
            const backTwo = results.runningNumbers.find(runningNumbers => runningNumbers.id === 'runningNumberBackTwo');


            setPrizeFirst(first);
            setPrizeFirstNear(firstNear);
            setPrizeSecond(second);
            setPrizeThird(third);
            setPrizeForth(forth);
            setPrizeFifth(fifth);
            setRunningNumberFrontThree(frontThree);
            setRunningNumberBackThree(backThree);
            setRunningNumberBackTwo(backTwo);
        };

        getResults();

    }, [results]);

    const handleChange = async (e) => {
        const dateId = e.target.value;
        try {
            const newResults = await fetchLottoResultById(dateId);
            setResults(newResults); // อัปเดตผลลัพธ์ใหม่
        } catch (error) {
            console.error("Error loading lotto results:", error);
        }
    };

    const splitIntoRows = (data, size) => {
        if (!Array.isArray(data)) return [];

        return data.reduce((rows, item, index) => {
            if (index % size === 0) rows.push([]);
            rows[rows.length - 1].push(item);
            return rows;
        }, []);
    };


    if (!results) {
        return <div>กำลังดึงข้อมูล...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md ">
            <div className="flex justify-between">
                <div>
                    <span className="text-2xl font-bold">ผลลอตเตอรี่งวด</span>
                    <span className="ms-2 text-xl font-bold">{results.date}</span>
                </div>
                <div className="flex items-center gap-5">
                    <span className="text-xl">เปลี่ยนงวด</span>
                    <select
                        className="py-2 px-4 bg-white border rounded-lg shadow w-60 me-10"
                        onChange={handleChange} // ใช้งาน handleChange ที่เราเพิ่ม
                        defaultValue=""
                    >
                        <option value="" disabled>
                            กรุณาเลือกวันที่
                        </option>
                        {lotteryList && lotteryList.map((lotto) => (
                            <option key={lotto.id} value={lotto.id}>
                                {lotto.date}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <table className="table-auto w-full border border-gray-300 my-10">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-500 py-3">
                                <div className="flex flex-col">
                                    <span className="text-red-500 font-bold">รางวัลที่ 1</span>
                                    <span className="text-gray-600 text-xs">รางวัลละ {prizeFirst?.reward} บาท</span>
                                </div>
                            </th>
                            <th className="border border-gray-500 py-3">
                                <div className="flex flex-col">
                                    <span className="text-red-500 font-bold">เลขหน้า 3 ตัว</span>
                                    <span className="text-gray-600 text-xs">รางวัลละ {prizeFirst?.reward} บาท</span>
                                </div>
                            </th>
                            <th className="border border-gray-500 py-3">
                                <div className="flex flex-col">
                                    <span className="text-red-500 font-bold">เลขท้าย 3 ตัว</span>
                                    <span className="text-gray-600 text-xs">รางวัลละ {prizeFirst?.reward} บาท</span>
                                </div>
                            </th>
                            <th className="border border-gray-500 py-3">
                                <div className="flex flex-col">
                                    <span className="text-red-500 font-bold">เลขท้าย 2 ตัว</span>
                                    <span className="text-gray-600 text-xs">รางวัลละ {prizeFirst?.reward} บาท</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-500">
                                <span className="flex justify-center py-5 text-3xl text-red-500 font-bold">
                                    {prizeFirst ? prizeFirst.number : 'ไม่พบข้อมูล'}
                                </span>
                            </td>
                            <td className="border border-gray-500">
                                <span className="flex justify-center py-5 text-3xl text-gray-600 font-bold gap-5">
                                    {runningNumberFrontThree ? runningNumberFrontThree.number.map((number, index) => (
                                        <span key={index}>
                                            {number}
                                        </span>

                                    )) : 'ไม่พบข้อมูล'}
                                </span>
                            </td>
                            <td className="border border-gray-500">
                                <span className="flex justify-center py-5 text-3xl text-gray-600 font-bold gap-5">
                                    {runningNumberBackThree ? runningNumberBackThree.number.map((number, index) => (
                                        <span key={index}>
                                            {number}
                                        </span>

                                    )) : 'ไม่พบข้อมูล'}
                                </span>
                            </td>
                            <td className="border border-gray-500">
                                <span className="flex justify-center py-5 text-3xl text-gray-600 font-bold">
                                    {runningNumberBackTwo ? runningNumberBackTwo.number : 'ไม่พบข้อมูล'}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="flex w-full items-center my-5">
                    <div className="flex flex-col w-auto ">
                        <span className="text-red-500">รางวัลข้างเคียงรางวัลที่ 1</span>
                        <span className="text-gray-600">2 รางวัลๆละ {prizeFirstNear?.reward} บาท</span>
                    </div>
                    <div className="flex flex-1 justify-around">
                        {prizeFirstNear ? (
                            prizeFirstNear.number.map((number, index) => (
                                <span className="text-gray-600 font-bold text-3xl" key={index}>
                                    {number}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-600 font-bold">ไม่พบข้อมูล</span>
                        )}
                    </div>
                </div>

                <hr className="text-gray-500" />

                <div className="flex flex-col items-center my-5 gap-5">
                    <span className="text-red-500">ผลสลากกินแบ่งรัฐบาล รางวัลที่ 2 มี 5 รางวัลๆละ {prizeSecond?.reward} บาท</span>
                    <div className="flex flex-wrap justify-center w-full gap-5">
                        {prizeSecond ? (
                            prizeSecond.number.map((number, index) => (
                                <span className="text-gray-600 font-bold text-2xl w-1/6 text-center" key={index}>{number}</span>
                            ))
                        ) : (
                            <span className="text-gray-600 font-bold text-2xl text-center">ไม่พบข้อมูล</span>
                        )}
                    </div>
                </div>

                <hr className="text-gray-500" />

                <div className="flex flex-col items-center w-full my-5 gap-5">
                    <span className="text-red-500 font-normal">
                        ผลสลากกินแบ่งรัฐบาล รางวัลที่ 3 มี 10 รางวัลๆละ {prizeThird?.reward} บาท
                    </span>
                    <div className="flex flex-wrap justify-center w-full gap-5">
                        {prizeThird ? (
                            prizeThird.number.map((number, index) => (
                                <span
                                    className="text-gray-600 font-bold text-2xl w-1/6 text-center"
                                    key={index}
                                >
                                    {number}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-600 font-bold text-2xl text-center">ไม่พบข้อมูล</span>
                        )}
                    </div>
                </div>

                <hr className="text-gray-500" />

                <div className="my-5">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th colSpan={5} className="text-center pb-5">
                                    <span className="text-red-500 font-normal">
                                        ผลสลากกินแบ่งรัฐบาล รางวัลที่ 4 มี 50 รางวัลๆละ {prizeForth?.reward} บาท
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {splitIntoRows(prizeForth?.number, 5).map((row, rowIndex) => (
                                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                    {row.map((number, colIndex) => (
                                        <td key={colIndex} className="text-center py-2 px-4 text-gray-600 font-bold">
                                            {number}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

                <hr className="text-gray-500" />

                <div className="my-5">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th colSpan={5} className="text-center pb-5">
                                    <span className="text-red-500 font-normal">
                                        ผลสลากกินแบ่งรัฐบาล รางวัลที่ 5 มี 100 รางวัลๆละ {prizeFifth?.reward} บาท
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {splitIntoRows(prizeFifth?.number, 5).map((row, rowIndex) => (
                                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                    {row.map((number, colIndex) => (
                                        <td key={colIndex} className="text-center py-2 px-4 text-gray-600 font-bold">
                                            {number}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default LotteryResults;
