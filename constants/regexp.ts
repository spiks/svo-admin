export const REGEXP_YOUTUBE = /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+$/g;

export const REGEXP_INSTAGRAM = /http(s)?:\/\/(www.)?instagram.com\/.+/;

export const REGEXP_TELEGRAM = /http(s)?:\/\/(www.)?(telegram|t)\.me\/.+/;

export const REGEXP_VK = /http(s)?:\/\/(www.)?vk.com\/.+/;

export const REGEXP_FACEBOOK = /http(s)?:\/\/(www.)?facebook.com\/.+/;

export const REGEXP_TWITTER = /http(s)?:\/\/(www.)?twitter.com\/.+/;

export const REGEXP_YOUTUBE_PROFILE = /http(s)?:\/\/(www.)?youtube.com\/channel\/.+/;

export const REGEXP_URL =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

export const REGEXP_EMAIL =
  /^[-!#$%&'*+\\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
