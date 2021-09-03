import { CheckIcon, CloseIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Divider,
  HStack,
  Image,
  SimpleGrid,
  Skeleton,
  Spacer,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { PersonalityContext } from "../Modules/personality";

type PersonalityPageParams = {
  username: string;
  movie_id: string;
};

type Movies = {
  recommendations: Array<any>;
  the_movie: any;
  the_movie_result: boolean | undefined;
};

const PersonalityPage = () => {
  let params = useParams<PersonalityPageParams>();
  const { personality, setPersonality } = useContext(PersonalityContext);
  const [isRetreiving, setIsRetreiving] = useState<boolean>(true);
  const [moviesLoading, setMoviesLoading] = useState<boolean>(true);
  const [movies, setMovies] = useState<Movies>({
    recommendations: [{}, {}],
    the_movie: {},
    the_movie_result: undefined,
  });
  const toast = useToast();
  const queryParams = new URLSearchParams(useLocation().search);
  const theMovieId = queryParams.get("movie_id");

  useEffect(() => {
    if (personality.mbti === "") {
      fetch(
        `http://192.168.43.72:8000/users/mbti/?format=json&id=${params.username}` +
          `${
            theMovieId !== undefined && theMovieId !== ""
              ? `&movie_id=${theMovieId}`
              : ""
          }`
      )
        .then((r) => r.json().then((data): any => ({ data, status: r.status })))
        .then((r) => {
          if (r.status === 200) setPersonality(r.data);
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
    } else {
      setIsRetreiving(false);
    }

    if (personality.mbti?.length === 4 && moviesLoading) {
      fetch(
        `http://192.168.43.72:8000/movies/recommend/?mbti=${personality.mbti}`
      )
        .then((r) => r.json())
        .then((r) => {
          setMovies(r);
        })
        .finally(() => {
          setMoviesLoading(false);
        });
    }
  });

  return (
    <>
      <Center paddingY="4rem" bg="gray.800" color="gray.300">
        <Center spacing="4rem" width="100%">
          {isRetreiving ? (
            <Spinner color="red.500" size="xl" padding="1rem" />
          ) : (
            <VStack spacing="5rem" width={theMovieId ? "100%" : "100%"}>
              {personality.mbti === undefined ? (
                <Text fontSize="xl">
                  This user, currently is not available in twitter.
                </Text>
              ) : (
                <>
                  <VStack>
                    <Text fontSize="3xl" marginBottom="1rem">
                      {params.username}'s personality type is
                    </Text>
                    <Center
                      borderRadius="2xl"
                      bg="gray.900"
                      paddingY="0.2rem"
                      paddingX="2rem"
                      sx={{ borderBottom: "solid 3px #63B3ED" }}
                    >
                      <Text
                        fontSize="5xl"
                        fontWeight="extrabold"
                        letterSpacing="widest"
                        color="gray.100"
                      >
                        {personality.mbti}
                      </Text>
                    </Center>
                  </VStack>
                </>
              )}
            </VStack>
          )}
          {theMovieId && (
            <>
              <Center height="12rem" marginX="2rem">
                <Divider orientation="vertical" borderColor="gray.500" />
              </Center>
              <Skeleton
                endColor="gray.700"
                startColor="gray.800"
                bg="gray.800"
                height="250px"
                minW="20rem"
                speed={1}
                isLoaded={!isRetreiving}
              >
                <HStack h="100%">
                  <Image height="inherit" src={movies.the_movie?.image_link} />
                  <VStack
                    paddingStart="1rem"
                    paddingEnd="2rem"
                    width="100%"
                    align="start"
                    spacing="1"
                  >
                    {movies.the_movie_result ? (
                      <Center bg="green.300" p="0.5rem 1rem" borderRadius="md">
                        <CheckIcon h="6" w="6" color="green.900" />
                        <Text color="green.900" ml="0.5rem">
                          Probably gonna like this! :)
                        </Text>
                      </Center>
                    ) : (
                      <Center bg="red.300" p="0.5rem 1rem" borderRadius="md">
                        <CloseIcon color="red.900" />
                        <Text color="red.900" ml="0.5rem">
                          Probably, you will not like this movie :(
                        </Text>
                      </Center>
                    )}
                    <HStack spacing="2">
                      <StarIcon w="4" h="4" color="yellow.400" />
                      <Text fontSize="2xl" color="white" fontWeight="bold">
                        {movies.the_movie?.imdb_rate}
                      </Text>
                      <Text>/ 10</Text>
                    </HStack>

                    <Text fontSize="xl" color="white">
                      {movies.the_movie?.name}
                    </Text>
                    <Text fontSize="sm" color="gray.300">
                      {movies.the_movie?.genre_list?.join(", ")}
                    </Text>
                    <Divider borderColor="gray.600" padding="0.5rem" />
                    <Spacer />
                    <Text fontSize="sm" color="gray.400" textAlign="justify">
                      {movies.the_movie?.description?.length > 220
                        ? movies.the_movie?.description?.substring(0, 220) +
                          "..."
                        : movies.the_movie?.description}
                    </Text>
                  </VStack>
                </HStack>
              </Skeleton>
            </>
          )}
        </Center>
      </Center>
      {personality.mbti !== undefined && (
        <Box width="100%" paddingY="2rem" bg="gray.900" color="gray.300">
          <Center>
            <Text fontSize="4xl" color="blue.200">
              {moviesLoading ? (
                <>
                  <Spinner size="lg" marginEnd="2" />
                  Finding!
                </>
              ) : (
                <>Movies found based on {params.username}'s MBTI</>
              )}
            </Text>
          </Center>
          <SimpleGrid padding="2rem" columns={2} spacing={10}>
            {movies.recommendations.map((movie) => {
              return (
                <Skeleton
                  endColor="gray.700"
                  startColor="gray.800"
                  bg="gray.800"
                  height="250px"
                  speed={1}
                  isLoaded={!moviesLoading}
                >
                  <HStack h="100%" w="100%">
                    <Image height="inherit" src={movie?.image_link} />
                    <VStack
                      paddingStart="1rem"
                      paddingEnd="2rem"
                      width="100%"
                      align="start"
                      spacing="1"
                    >
                      <HStack spacing="2">
                        <StarIcon w="4" h="4" color="yellow.400" />
                        <Text fontSize="2xl" color="white" fontWeight="bold">
                          {movie?.imdb_rate}
                        </Text>
                        <Text>/ 10</Text>
                      </HStack>

                      <Text fontSize="xl" color="white">
                        {movie?.name}
                      </Text>
                      <Text fontSize="sm" color="gray.300">
                        {movie?.genre_list?.join(", ")}
                      </Text>
                      <Divider borderColor="gray.600" padding="0.5rem" />
                      <Spacer />
                      <Text fontSize="sm" color="gray.400" textAlign="justify">
                        {movie?.description?.length > 220
                          ? movie?.description?.substring(0, 220) + "..."
                          : movie?.description}
                      </Text>
                    </VStack>
                  </HStack>
                </Skeleton>
              );
            })}
          </SimpleGrid>
        </Box>
      )}
    </>
  );
};

export { PersonalityPage };
