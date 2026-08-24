import { Intro } from '@/app/test/intro';
import Text from '@/app/test/text';

const IMAGES = [
  'https://i.pinimg.com/736x/cf/ad/4a/cfad4a21cd2a84f22979e5b757e09c07.jpg',
  'https://i.pinimg.com/1200x/f1/82/97/f182976f1382eebd7be2c0526142587c.jpg',
  'https://i.pinimg.com/1200x/86/5f/2a/865f2aac5c8f5a1a073798413b222b12.jpg',
  'https://i.pinimg.com/1200x/3c/37/f2/3c37f252a137532052162372e221d04e.jpg',
  '/landing.jpg',
];

const INTRO_END_DELAY_SEC = 0.35 + (IMAGES.length - 1) * 0.25 + 1 + 1;

export default function TestPage() {
  return (
    <main>
      <Intro images={IMAGES} />
      <Text delay={INTRO_END_DELAY_SEC}>Every Frame has it&apos;s Place</Text>
    </main>
  );
}
