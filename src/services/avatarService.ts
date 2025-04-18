import { createAvatar } from '@dicebear/core';
import * as adventurer from '@dicebear/collection/adventurer';
import * as adventurerNeutral from '@dicebear/collection/adventurer-neutral';
import * as bottts from '@dicebear/collection/bottts';

interface AvatarOptions {
  style: 'adventurer' | 'adventurer-neutral' | 'bottts';
  seed: string;
  backgroundColor?: string[];
  accessories?: string[];
  clothing?: string[];
  eyes?: string[];
  hair?: string[];
  skinColor?: string[];
}

export const generateAvatar = (options: AvatarOptions): string => {
  const styles = {
    adventurer,
    'adventurer-neutral': adventurerNeutral,
    bottts,
  };

  const avatar = createAvatar(styles[options.style], {
    seed: options.seed,
    backgroundColor: options.backgroundColor,
    accessories: options.accessories,
    clothing: options.clothing,
    eyes: options.eyes,
    hair: options.hair,
    skinColor: options.skinColor,
  });

  return avatar.toDataUri();
};

export default {
  generateAvatar,
};