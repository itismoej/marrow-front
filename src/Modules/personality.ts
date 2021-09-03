import { createContext } from "react";

type defaultPersonality = {
  personality: Personality;
  setPersonality: any;
};

export const PersonalityContext = createContext<defaultPersonality>({
  personality: { mbti: "" },
  setPersonality: (personality: Personality) => {},
});

export type Personality = {
  mbti:
    | undefined
    | string
    | "ISTJ"
    | "ISFJ"
    | "INFJ"
    | "INTJ"
    | "ISTP"
    | "ISFP"
    | "INFP"
    | "INTP"
    | "ESTP"
    | "ESFP"
    | "ENFP"
    | "ENTP"
    | "ESTJ"
    | "ESFJ"
    | "ENFJ"
    | "ENTJ";
};
