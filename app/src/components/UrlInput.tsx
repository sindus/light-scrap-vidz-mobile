import { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { isValidUrl } from '@/lib/url-validator';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function UrlInput({ onSubmit, isLoading, disabled }: UrlInputProps) {
  const [value, setValue] = useState('');
  const trimmed = value.trim();
  const valid = isValidUrl(trimmed);

  const submit = () => {
    if (valid && !disabled && !isLoading) onSubmit(trimmed);
  };

  return (
    <View style={styles.row}>
      <View style={styles.inputWrap}>
        <Feather name="link" size={16} color={colors.textMuted} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder="Paste a video or profile URL"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="go"
          editable={!disabled}
          onSubmitEditing={submit}
        />
      </View>
      <TouchableOpacity
        style={[styles.button, (!valid || disabled || isLoading) && styles.buttonDisabled]}
        onPress={submit}
        disabled={!valid || disabled || isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Feather name="arrow-right" size={18} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    paddingVertical: 12,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
