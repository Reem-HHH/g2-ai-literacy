/**
 * Asset manifest for Lesson 1.
 * Replace any file in /public/images with a licensed classroom photo
 * using the same filename — no component changes needed.
 *
 * TEMPORARY: real Unsplash photographs, verified by visual check.
 * A few filenames keep the planned keys even if the species differs;
 * alt text always matches the actual photo.
 */
export type ImageAsset = {
  src: string;
  alt: string;
  placeholder?: boolean;
};

export const assets = {
  birdRobin: {
    src: '/images/owl.jpg',
    alt: 'A robin with a red-orange chest singing on a branch',
    placeholder: true,
  },
  birdParrot: {
    src: '/images/parrot.jpg',
    alt: 'A green parrot showing feathers and a curved beak',
    placeholder: true,
  },
  birdKingfisher: {
    src: '/images/sparrow.jpg',
    alt: 'A blue and orange kingfisher perched on a twig',
    placeholder: true,
  },
  birdEagle: {
    src: '/images/eagle.jpg',
    alt: 'A bald eagle flying with wings spread wide',
    placeholder: true,
  },
  birdFlamingo: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/American_flamingo_at_the_Zoo_Atlanta.jpg/800px-American_flamingo_at_the_Zoo_Atlanta.jpg',
    alt: 'A pink flamingo standing, with long legs, a beak, and feathers',
    placeholder: true,
  },
  catClear1: {
    src: '/images/cat-clear-1.jpg',
    alt: 'A clear photo of a black-and-white cat looking at the camera',
    placeholder: true,
  },
  catClear2: {
    src: '/images/cat-clear-2.jpg',
    alt: 'A clear photo of a tabby cat with green eyes',
    placeholder: true,
  },
  catClear3: {
    src: '/images/cat-clear-3.jpg',
    alt: 'A clear photo of an orange cat standing sideways',
    placeholder: true,
  },
  catOrange: {
    src: '/images/cat-orange.jpg',
    alt: 'A fluffy orange cat looking up',
    placeholder: true,
  },
  catTabbyKitten: {
    src: '/images/cat-black.jpg',
    alt: 'A small tabby kitten',
    placeholder: true,
  },
  catCream: {
    src: '/images/cat-white-2.jpg',
    alt: 'A cream-coloured cat with blue eyes',
    placeholder: true,
  },
  catBeige: {
    src: '/images/cat-white-4.jpg',
    alt: 'A beige and white cat sitting by a window',
    placeholder: true,
  },
  catGingerSleep: {
    src: '/images/cat-white-1.jpg',
    alt: 'An orange cat lying on its back',
    placeholder: true,
  },
  dogClear: {
    src: '/images/dog-clear.jpg',
    alt: 'A golden retriever puppy sitting and holding a flower',
    placeholder: true,
  },
  dogClear2: {
    src: '/images/dog-clear-2.jpg',
    alt: 'A brown and white dog smiling at the camera',
    placeholder: true,
  },
  rabbitClear: {
    src: '/images/rabbit.jpg',
    alt: 'A white rabbit sitting in grass',
    placeholder: true,
  },
  car: {
    src: '/images/car.jpg',
    alt: 'A grey sports car facing the camera',
    placeholder: true,
  },
  trafficLight: {
    src: '/images/traffic-light.svg',
    alt: 'A traffic light with red, yellow, and green lights',
  },
  phone: {
    src: '/images/phone.jpg',
    alt: 'A smartphone with apps on the screen',
    placeholder: true,
  },
  robot: {
    src: '/images/robot.jpg',
    alt: 'A friendly white helper robot',
    placeholder: true,
  },
  phones: {
    src: '/images/face-id.jpg',
    alt: 'Several phones that can see faces and objects with their cameras',
    placeholder: true,
  },
  chat: {
    src: '/images/chat.jpg',
    alt: 'A phone showing messaging apps used for chatting',
    placeholder: true,
  },
} as const satisfies Record<string, ImageAsset>;

export type AssetKey = keyof typeof assets;
