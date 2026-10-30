import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';
import { Access } from './access';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    img: (props: ComponentProps<'img'>) => <ImageZoom {...(props as ComponentProps<typeof ImageZoom>)} />,
    Access,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
