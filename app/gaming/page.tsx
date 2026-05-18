'use client';

import { useState } from 'react';
import { GameCard } from '@/components/gaming/GameCard';
import { GradeSelector } from '@/components/gaming/GradeSelector';
import { XPProgress } from '@/components/gaming/XPProgress';

const GAMES = [
  {
    title: 'Typing Meteor Defense',
    description:
      'Practice keyboard skills by typing letters, words, and answers before the meteors land.',
    skills: ['Keyboarding', 'Letter recognition', 'Spelling', 'Math facts'],
    grades: '1st–5th',
    href: '/gaming/typing-meteor-defense',
  },
  {
    title: 'Story Sort Drag-and-Drop',
    description:
      'Drag items into the correct order or category to build reading and math skills.',
    skills: ['Mouse control', 'Comprehension', 'Sequencing', 'Grammar', 'Math sorting'],
    grades: 'Kindergarten–5th',
    href: '/gaming/story-sort',
  },
  {
    title: 'Precision Painter Studio',
    description: 'Trace, color, outline, and create while building smooth mouse and trackpad control.',
    skills: ['Mouse precision', 'Drag control', 'Tracing', 'Focus', 'Visual coordination'],
    grades: 'Kindergarten–5th',
    href: '/gaming/precision-painter-studio',
  },
  {
    title: 'Code Keys Workshop',
    description: 'Repair robots, activate inventions, and learn keyboard symbols through beginner coding challenges.',
    skills: ['Keyboarding', 'Symbols', 'Coding readiness', 'Logic', 'Typing confidence'],
    grades: 'Kindergarten–5th',
    href: '/gaming/code-keys-workshop',
  },
  {
    title: 'Rhythm Row Typing',
    description: 'Follow rhythmic typing patterns and build smooth keyboard skills through music and movement.',
    skills: ['Keyboarding', 'Rhythm', 'Typing flow', 'Home row confidence', 'Timing'],
    grades: 'Kindergarten–5th',
    href: '/gaming/rhythm-row-typing',
  },
  {
    title: 'Keyboard Expedition',
    description: 'Explore ancient ruins, caves, forests, and hidden stations by typing clues, directions, and commands.',
    skills: ['Keyboarding', 'Typing fluency', 'Vocabulary', 'Comprehension', 'Instruction-following'],
    grades: 'Kindergarten–5th',
    href: '/gaming/keyboard-expedition',
  },
  {
    title: 'Bug Trail Maze',
    description: 'Guide a friendly bug through paths, collect learning items, and practice smooth mouse control.',
    skills: ['Mouse tracking', 'Cursor control', 'Path accuracy', 'Focus', 'Sequencing'],
    grades: 'Kindergarten–5th',
    href: '/gaming/bug-trail-maze',
  },
  {
    title: 'Math Key Quest',
    description: 'Solve math challenges by typing answers and using number keys with confidence.',
    skills: ['Keyboarding', 'Number row', 'Math facts', 'Symbols', 'Accuracy'],
    grades: 'Kindergarten–5th',
    href: '/gaming/math-key-quest',
  },
  {
    title: 'Word Builder Farm',
    description: 'Build words by typing letters in the right order and helping the farm grow.',
    skills: ['Keyboarding', 'Spelling', 'Phonics', 'Sight words', 'Vocabulary'],
    grades: 'Kindergarten–5th',
    href: '/gaming/word-builder-farm',
  },
  {
    title: 'Target Tracker Adventure',
    description:
      'Follow a moving character, collect learning items, and improve cursor control.',
    skills: ['Mouse tracking', 'Clicking accuracy', 'Focus', 'Reaction timing'],
    grades: '2nd–5th',
    href: '/gaming/target-tracker',
  },

  {
    title: 'Circuit Builder Lab',
    description: 'Connect pathways, power inventions, and solve logic challenges through drag-and-drop building.',
    skills: ['Drag-and-drop', 'Sequencing', 'Logic', 'Coding readiness', 'STEM thinking'],
    grades: 'Kindergarten–5th',
    href: '/gaming/circuit-builder-lab',
  },

  {
    title: 'Gravity Workshop',
    description: 'Experiment with shapes, balance, gravity, and motion to solve physics-based challenges.',
    skills: ['STEM reasoning', 'Physics intuition', 'Logic', 'Engineering', 'Spatial thinking'],
    grades: 'Kindergarten–5th',
    href: '/gaming/gravity-workshop',
  },

  {
    title: 'Discovery Trails',
    description: 'Explore forests, caves, deserts, oceans, and hidden lands through typing, choices, and educational challenges.',
    skills: ['Typing', 'Reading comprehension', 'Vocabulary', 'Sequencing', 'Decision-making'],
    grades: 'Kindergarten–5th',
    href: '/gaming/discovery-trails',
  },

  {
    title: 'Word Storm',
    description: 'Type words before they drift through the storm and stabilize the learning environment.',
    skills: ['Typing fluency', 'Spelling', 'Vocabulary', 'Reaction timing'],
    grades: 'Kindergarten–5th',
    href: '/gaming/word-storm',
  },

  {
    title: 'Memory Match',
    description: 'Flip, discover, and connect educational matches through memory and pattern recognition.',
    skills: ['Memory', 'Focus', 'Vocabulary', 'Sequencing', 'Visual recognition'],
    grades: 'Kindergarten–5th',
    href: '/gaming/memory-match',
  },

  {
    title: 'Cipher Quest',
    description: 'Decode hidden messages, solve educational mysteries, and uncover secret knowledge through logic and typing.',
    skills: ['Logic', 'Decoding', 'Typing', 'Vocabulary', 'Reading comprehension'],
    grades: 'Kindergarten–5th',
    href: '/gaming/cipher-quest',
  },

  {
    title: 'Droplets',
    description: 'Type falling letters before they reach the ground and watch completed words come together through rain-powered learning.',
    skills: ['Typing', 'Spelling', 'Phonics', 'Word formation', 'Sequencing'],
    grades: 'Kindergarten–5th',
    href: '/gaming/droplets',
  },

  {
    title: 'Shakerz',
    description: 'Trigger silly tremors, complete educational click challenges, and watch tiny worlds react in playful ways.',
    skills: ['Mouse clicking', 'Focus', 'Visual tracking', 'Educational recognition'],
    grades: 'Kindergarten–5th',
    href: '/gaming/shakerz',
  },
  {
    title: 'Keyboard Quest Duels',
    description: 'A future cooperative challenge for quick typing and reading response skills.',
    skills: ['Keyboarding', 'Reading fluency', 'Attention control'],
    grades: '3rd–5th',
    href: '/gaming',
    comingSoon: true,
  },
];

export default function GamingHubPage() {
  const [selectedGrade, setSelectedGrade] = useState('3rd');

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-3xl bg-gradient-to-r from-sky-900 via-indigo-900 to-purple-900 p-6 shadow-xl">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Gaming</h1>
          <p className="mt-2 max-w-2xl text-base text-sky-100 sm:text-lg">
            Build keyboard, mouse, and computer skills through fun learning games. Games help students practice keyboard, mouse, tracking, and learning skills.
          </p>
          <p className="mt-4 text-sm text-sky-200">Optimized for desktop/laptop play, with mobile and tablet support.</p>
        </header>

        <XPProgress xp={320} />
        <GradeSelector selectedGrade={selectedGrade} onChange={setSelectedGrade} />

        <section className="grid gap-4 md:grid-cols-2">
          {GAMES.map((game) => (
            <GameCard key={game.title} {...game} />
          ))}
        </section>

        {/* TODO: Connect game cards to real per-user progress from Supabase user_game_progress table. */}
        {/* TODO: Hook approved gentle sound effects (soft chime, pop, sparkle) into completed-game events only. */}
      </div>
    </main>
  );
}
