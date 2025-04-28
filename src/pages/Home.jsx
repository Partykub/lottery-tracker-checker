import { useEffect, useState } from 'react';
import LotteryResults from '../components/LotteryResults';
import { fetchLatestLotteryResults } from '../api/lotteryAPI';
import LotteryVault from '../components/LotteryVault';
import LotteryChecker from '../components/LotteryChecker';
import StatisticalInsights from '../components/StatisticalInsights';
import FavoriteNumbers from '../components/FavoriteNumbers';

const Home = () => {
  return (
    <div className="p-6 flex justify-evenly">
      <div className='flex flex-col gap-5'>
        <StatisticalInsights />
        <FavoriteNumbers />
      </div>
      <div className='w-1/2'>
        <LotteryResults/>
      </div>
      <div className='flex flex-col gap-3'>
        <LotteryVault />
        <LotteryChecker />
      </div>
    </div>
  );
};

export default Home;
