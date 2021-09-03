import { Center, Spinner, useToast, VStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PersonalityContext } from "../Modules/personality";

type PersonalityPageParams = {
  username: string;
};

const PersonalityPage = () => {
  let params = useParams<PersonalityPageParams>();
  const { personality, setPersonality } = useContext(PersonalityContext);
  const [isRetreiving, setIsRetreiving] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    if (personality.mbti === "") {
      fetch(
        `http://192.168.43.72:8000/users/mbti/?format=json&id=${params.username}`
      )
        .then((r) =>
          r.json().then((data): any => ({ ...data, status: r.status }))
        )
        .then((r) => {
          if (r.status === 200) setPersonality(r);
          else if (r.status === 400) {
            setPersonality({ mbti: undefined });
            toast({
              position: "bottom-left",
              title: "Error",
              description: r.error,
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          }
        })
        .finally(() => {
          setIsRetreiving(false);
        });
    }
  });

  return (
    <Center paddingY="15rem" bg="gray.800" color="gray.300">
      {isRetreiving ? (
        <Spinner color="red.500" size="xl" padding="1rem" />
      ) : (
        <VStack>
          {personality.mbti === undefined ? (
            <p>This user, currently is not available in twitter.</p>
          ) : (
            <>
              <p>Hi, {params.username}.</p>
              <p> Your personality type is {personality.mbti}.</p>
            </>
          )}
        </VStack>
      )}
    </Center>
  );
};

export { PersonalityPage };
