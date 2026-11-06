/**
 * ANYFIX — Service Questions & Issues Configuration
 * 
 * Provides service-specific questions and diagnostic issue options for every repair service.
 */

export interface ServiceQuestionConfig {
  question: string;
  options: string[];
}

export const SERVICE_QUESTIONS_MAP: Record<string, ServiceQuestionConfig> = {
  screen: {
    question: 'What issue are you facing with your display?',
    options: [
      'Screen cracked or broken glass',
      'Touch not working or ghost touches',
      'Display has colored lines or ink spots',
      'Black or completely blank display',
      'Screen flickering or dim brightness',
      'Other display issue',
    ],
  },
  battery: {
    question: 'What issue are you experiencing with your battery?',
    options: [
      'Battery draining unusually fast',
      'Phone randomly turns off before 0%',
      'Battery swollen or lifting screen/back glass',
      'Phone overheating during normal use or charging',
      'Battery health degraded service warning',
      'Other battery issue',
    ],
  },
  charging: {
    question: 'What problem are you having with charging?',
    options: [
      'Phone not charging or detecting charger',
      'Loose charging port / works only at specific angle',
      'Slow charging or fast-charge not activating',
      'Liquid or moisture detected warning in port',
      'Port physically damaged, clogged or broken',
      'Other charging issue',
    ],
  },
  back: {
    question: 'What damage does the back panel or body have?',
    options: [
      'Rear back glass cracked or shattered',
      'Camera bump or frame scratched / dented',
      'Bent phone frame or housing gap',
      'Back panel peeling off or loose adhesive',
      'Other body or housing damage',
    ],
  },
  camera: {
    question: 'What camera issue are you encountering?',
    options: [
      'Camera lens glass cracked or scratched',
      'Camera blurry or won’t autofocus',
      'Camera app freezes or shows black screen',
      'Shaky or vibrating image (stabilization issue)',
      'Spots or dark shadows in captured photos',
      'Other camera issue',
    ],
  },
  audio: {
    question: 'What audio problem are you noticing?',
    options: [
      'Low volume or distorted / crackling speaker',
      'Cannot hear caller through ear receiver',
      'Loudspeaker completely silent for calls & media',
      'Buzzing noise at medium or high volume',
      'Other speaker issue',
    ],
  },
  mic: {
    question: 'What microphone issue are you having?',
    options: [
      'Callers cannot hear me during phone calls',
      'Voice recordings / WhatsApp voice notes are muffled',
      'Video recordings have static noise or no sound',
      'Siri or Google Assistant does not respond to voice',
      'Other microphone issue',
    ],
  },
  buttons: {
    question: 'Which button is not functioning properly?',
    options: [
      'Power / Lock button stuck or unresponsive',
      'Volume Up or Volume Down button not clicking',
      'Mute switch or Action button broken',
      'Buttons physically loose, jammed or fallen out',
      'Other button issue',
    ],
  },
  water: {
    question: 'What occurred during exposure to liquid?',
    options: [
      'Dropped in water and turned off immediately',
      'Phone powers on but screen / touch is glitching',
      'Speakers or charging port stopped working',
      'Phone overheating or stuck in restart loop',
      'Other liquid damage issue',
    ],
  },
  software: {
    question: 'What software problem is your phone showing?',
    options: [
      'Stuck on boot logo loop (Apple / Android logo)',
      'Phone keeps freezing and restarting automatically',
      'Failed OS update or recovery mode screen',
      'Apps crashing constantly or extreme sluggishness',
      'Other software issue',
    ],
  },
  other: {
    question: 'Please specify the issue you need fixed:',
    options: [
      'Wi-Fi, Bluetooth or cellular network signal failure',
      'Face ID or Fingerprint sensor not working',
      'Vibration motor not haptic or silent',
      'Complete diagnostic inspection needed',
      'Other hardware issue',
    ],
  },
};

/**
 * Returns service-specific question & issue options for any given service name.
 * Intelligently matches service keywords or creates tailored questions.
 */
export function getServiceQuestion(serviceName: string): ServiceQuestionConfig {
  const lower = (serviceName || '').trim().toLowerCase();

  if (lower.includes('screen') || lower.includes('display') || lower.includes('glass')) {
    return SERVICE_QUESTIONS_MAP.screen;
  }
  if (lower.includes('battery')) {
    return SERVICE_QUESTIONS_MAP.battery;
  }
  if (lower.includes('charging') || lower.includes('port')) {
    return SERVICE_QUESTIONS_MAP.charging;
  }
  if (lower.includes('back') || lower.includes('housing') || lower.includes('body')) {
    return SERVICE_QUESTIONS_MAP.back;
  }
  if (lower.includes('camera') || lower.includes('lens')) {
    return SERVICE_QUESTIONS_MAP.camera;
  }
  if (lower.includes('mic') || lower.includes('microphone')) {
    return SERVICE_QUESTIONS_MAP.mic;
  }
  if (lower.includes('speaker') || lower.includes('audio') || lower.includes('sound') || lower.includes('earpiece')) {
    return SERVICE_QUESTIONS_MAP.audio;
  }
  if (lower.includes('button') || lower.includes('power') || lower.includes('volume')) {
    return SERVICE_QUESTIONS_MAP.buttons;
  }
  if (lower.includes('water') || lower.includes('liquid') || lower.includes('moisture')) {
    return SERVICE_QUESTIONS_MAP.water;
  }
  if (lower.includes('software') || lower.includes('boot') || lower.includes('freeze')) {
    return SERVICE_QUESTIONS_MAP.software;
  }

  // Dynamic fallback for any other service name
  return {
    question: `What issue are you facing with your ${serviceName}?`,
    options: [
      `${serviceName} not working properly`,
      'Intermittent failure or glitches',
      'Physical damage or wear and tear',
      'Diagnostic checkup required',
      'Other issue',
    ],
  };
}
