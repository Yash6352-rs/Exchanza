import { ScrollView, Text, TouchableOpacity } from 'react-native';
import React from 'react'
import { lightColors } from '@/app/components/theme/colors';
import { useTheme } from '@/context/ThemeContext';

type Props = {
    selected: string,
    onSelect: (tag: string) => void;
    tags: string[];
};

export default function TagFilterBar({ selected, onSelect, tags }: Props) {
    const { theme } = useTheme();
    const allTags = ["All", ...tags];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mb-3'>
        {allTags.map((tag) => {
            const isActive = selected === tag;

            return (
                <TouchableOpacity
                    key={tag}
                    onPress={() => onSelect(tag)}
                    className='px-4 py-2.5 rounded-full mr-2'
                    style={{
                        backgroundColor: isActive 
                            ? theme?.primary || lightColors.primary 
                            : theme?.lightGray || lightColors.lightGray,

                        borderWidth: isActive ? 0 : 1,
                        borderColor: theme?.border || lightColors.border,
                    }}           
                >
                    <Text
                        className='text-sm font-medium'
                        style={{ color: isActive ? "#fff" : theme?.text || lightColors.text }}
                    >
                        {tag}
                    </Text>
                </TouchableOpacity>
            );
        })}
    </ScrollView>
  );
}
