import { width } from "@mui/system";

// Helper function to generate optimized Cloudinary URLs
// Update the optimization parameters
const getOptimizedUrl = (originalUrl) => {
  if (!originalUrl.includes("cloudinary.com")) return originalUrl;

  const parts = originalUrl.split("/upload/");
  if (parts.length !== 2) return originalUrl;

  const baseUrl = parts[0] + "/upload";
  const transformations =
    "c_fill,g_auto,q_auto:best,f_auto,w_1920,dpr_auto,fl_progressive:steep/";

  return `${baseUrl}/${transformations}/${parts[1]}`;
};

// Helper function for mobile images
const getMobileOptimizedUrl = (originalUrl) => {
  if (!originalUrl.includes("cloudinary.com")) return originalUrl;

  const parts = originalUrl.split("/upload/");
  if (parts.length !== 2) return originalUrl;

  const baseUrl = parts[0] + "/upload";
  const transformations =
    "c_fill,g_auto,q_auto:best,f_auto,w_828,dpr_auto,fl_progressive:steep";

  return `${baseUrl}/${transformations}/${parts[1]}`;
};

export const categories = {
  V00: [
    {
      path: "v00",
      img: getOptimizedUrl(
        "https://res.cloudinary.com/dmjhto8sd/image/upload/v1741398926/donated_skjclx.webp"
      ),
      productId: "UHJvZHVjdDo0",
    },
    {
      path: "v00",
      img: getOptimizedUrl(
        "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740255295/main_minified_dvrel3.webp"
      ),
      productId: "UHJvZHVjdDo0",
      priority: true,
      preload: true,
    },
    {
      path: "v00",
      img: getOptimizedUrl(
        "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740375247/main_3_f0ewvp.webp"
      ),
      productId: "UHJvZHVjdDo0",
    },
    { type: "footer" },
  ],
  // WOMEN: [
  //   {
  //     path: "women1",
  //     img: "https://static.Clothd.net/assets/public/1c74/6ff4/64a74930be5c/0c2d1724a7ff/image-landscape-46d31401-b6cc-4ddd-ba6f-59743156450d-default_0/image-landscape-46d31401-b6cc-4ddd-ba6f-59743156450d-default_0.jpg?ts=1737365086986&w=1384",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   {
  //     path: "women2",
  //     img: "https://static.Clothd.net/assets/public/756a/1804/42284cf58611/7312275089cb/image-landscape-1-17aa02ad-7eaf-499d-93ef-d3b8b9d9a78d-default_0/image-landscape-1-17aa02ad-7eaf-499d-93ef-d3b8b9d9a78d-default_0.jpg?ts=1738570252190&w=1458",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   {
  //     video:
  //       "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381505/jeans_mzvwwq.mp4",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   { type: "footer" },
  // ],
  // MEN: [
  //   {
  //     path: "men2",
  //     video: "blob:https://www.Clothd.com/cf821dd4-10f1-412c-885c-5bebb8a7d728",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   {
  //     path: "men1",
  //     img: "https://static.Clothd.net/assets/public/a04f/7c52/7208479d90b3/405b1951ea68/image-landscape-default-fill-a4d13a6e-dbe6-4259-b2a9-ca2d6c155f52-default_0/image-landscape-default-fill-a4d13a6e-dbe6-4259-b2a9-ca2d6c155f52-default_0.jpg?ts=1736427762917&w=1384",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   {
  //     path: "men2",
  //     video: "blob:https://www.Clothd.com/cf821dd4-10f1-412c-885c-5bebb8a7d728",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   {
  //     path: "men2",
  //     img: "https://static.Clothd.net/assets/public/4894/1c0a/4b78411c84c8/87ed0fc65938/image-landscape-default-fill-727a6739-cd4d-49a6-858a-181f8454ef44-default_0/image-landscape-default-fill-727a6739-cd4d-49a6-858a-181f8454ef44-default_0.jpg?ts=1736755109152&w=1384",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },

  //   { type: "footer" },
  // ],

  // ARCHIVE: [
  //   {
  //     video:
  //       "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381101/gett0nihpxj7tgkg4tg3.mp4",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   { type: "footer" },
  // ],
};

export const categoriesMobile = {
  V00: [
    {
      path: "v00",
      img: getMobileOptimizedUrl("https://res.cloudinary.com/dmjhto8sd/image/upload/v1741400168/Mobile_main_x1ckwh.webp"),
      productId: "UHJvZHVjdDo0",
      priority: true,
      preload: true,
    },
    {
      path: "v00",
      img: getMobileOptimizedUrl("https://res.cloudinary.com/dmjhto8sd/image/upload/v1740544747/Main-Mobile_qt4rgz.webp"),
      productId: "UHJvZHVjdDo0",
      preload: true
    },
    // {
    //   video: getMobileOptimizedUrl(
    //     "https://res.cloudinary.com/dmjhto8sd/video/upload/v1740108755/B444A4EE-6BBA-437C-947E-155D4BE435FD_keoyu7.mp4"),
    //   productId: "UHJvZHVjdDox",
    // },
    { type: "footer" },
  ],
  // WOMEN: [
  //   {
  //     path: "women1",
  //     img: "https://static.Clothd.net/assets/public/5f77/7ab9/8c534f389379/4ea43a284804/image-portrait-272a2eff-f010-40bf-b9b7-b3203105abca-default_0/image-portrait-272a2eff-f010-40bf-b9b7-b3203105abca-default_0.jpg?ts=1738415616658&w=824",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   {
  //     path: "women2",
  //     img: "https://static.Clothd.net/assets/public/a020/327a/03ac4519bbd9/9fa951357567/image-portrait-default-fill-05d4c0b6-7247-4fca-8869-2c00ab494e48-default_0/image-portrait-default-fill-05d4c0b6-7247-4fca-8869-2c00ab494e48-default_0.jpg?ts=1738605881607&w=824",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   {
  //     video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   { type: "footer" },
  // ],
  // MEN: [
  //   {
  //     path: "men2",
  //     video: "blob:https://www.Clothd.com/cf821dd4-10f1-412c-885c-5bebb8a7d728",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   {
  //     path: "men1",
  //     img: "https://static.Clothd.net/assets/public/b798/1280/17404e118c75/8ff5dfe8dec5/image-portrait-vertical-3-default-fill-0f5a689c-939e-4194-9de8-23dc66a39d44-default_0/image-portrait-vertical-3-default-fill-0f5a689c-939e-4194-9de8-23dc66a39d44-default_0.jpg?ts=1738333099419&w=824",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   {
  //     path: "men2",
  //     video: "blob:https://www.Clothd.com/cf821dd4-10f1-412c-885c-5bebb8a7d728",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   {
  //     path: "men2",
  //     img: "https://static.Clothd.net/assets/public/4894/1c0a/4b78411c84c8/87ed0fc65938/image-landscape-default-fill-727a6739-cd4d-49a6-858a-181f8454ef44-default_0/image-landscape-default-fill-727a6739-cd4d-49a6-858a-181f8454ef44-default_0.jpg?ts=1736755109152&w=1384",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },

  //   { type: "footer" },
  // ],

  // ARCHIVE: [
  //   {
  //     video:
  //       "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381101/gett0nihpxj7tgkg4tg3.mp4",
  //     productId: "UHJvZHVjdDoxNjA=",
  //   },
  //   { type: "footer" },
  // ],
};
