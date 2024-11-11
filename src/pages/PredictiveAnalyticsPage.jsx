import React from 'react'
import PredictionDisplay from '../components/prediction/PredictionDisplay'

export const PredictiveAnalyticsPage = () => {
  return (
    <div className='flex h-svh items-center space-x-10 pl-10 pr-10'>
      <PredictionDisplay/>
      <PredictionDisplay/>
    </div>
  )
}
