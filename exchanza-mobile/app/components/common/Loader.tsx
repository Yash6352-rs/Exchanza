import { ActivityIndicator, View } from 'react-native'
import React from 'react'
import { lightColors } from '../theme/colors'

type LoaderProps = {
  fullScreen?: boolean;
  size?: "small" | "large";
  color?: string;
}

export const Loader = ({
  fullScreen = false, size="large", color= lightColors.primary }: LoaderProps) => {

  return (
    <View 
        className={`items-center justify-center ${fullScreen ? 'flex-1' : 'py-4'} `}
    >
      <ActivityIndicator size={size} color={color}/>
    </View>
  )
}

 
