import { Text, View } from 'react-native'
import React from 'react'
import { lightColors } from "../theme/colors"
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/context/ThemeContext'

export const EmptyState = ({title, description, icon, classname= ""}: any) => {
  const { theme } = useTheme();
  return (
    <View className={`flex-1 items-center justify-center px-6 ${classname}`}>
        {icon && (
          <View className='mb-4'>
            <Ionicons name={icon} size={50} />
          </View>
        )}

      <Text className='text-lg font-semibold text-center' style={{ color: theme?.text || lightColors.text }}>
        {title}
      </Text>

      {description && (
        <Text className='text-sm text-center mt-2' style={{ color: theme?.subText || lightColors.subText }}>
            {description}
        </Text>
      )}
      
    </View>
  )
}
