import { RichText } from 'prismic-dom';

export function getMinutesToRead(
  content: Array<{ heading: string; body: any }>
): string {
  // eslint-disable-next-line no-shadow
  const allContentText = content.reduce<string>((text, content) => {
    // eslint-disable-next-line no-param-reassign
    text += ` ${content.heading}` as string;

    if (Array.isArray(content.body)) {
      // eslint-disable-next-line no-param-reassign
      text += ` ${RichText.asText(content.body)}`;
    }

    return text;
  }, '');

  const words = allContentText.split(/\s+/g).filter(Boolean);
  return `${Math.ceil(words.length / 200)} min`;
}
