import { Post } from '../types.ts';

export let posts: Post[] = [
  {
    id: '1',
    title: 'The Rise of Modern Frontend Frameworks',
    content: `
In the ever-evolving landscape of web development, frontend frameworks have become the cornerstone of building modern, interactive, and performant web applications. From the declarative nature of React to the comprehensive ecosystem of Angular and the approachable simplicity of Vue, developers have a plethora of powerful tools at their disposal.

This post delves into the history and evolution of these frameworks, comparing their core philosophies and architectures. We'll explore the concept of the Virtual DOM, the rise of component-based architecture, and how state management libraries like Redux and Vuex have revolutionized how we handle application data. We'll also touch upon the newcomers like Svelte, which shifts much of the work to compile time, promising even faster and more efficient applications.

Join us as we journey through the timeline of frontend development, celebrating the innovations that have made the web the rich, dynamic platform it is today.
    `,
    author: 'Jane Doe',
    date: '2023-10-26',
    imageUrl: 'https://picsum.photos/seed/frameworks/800/400',
    excerpt: 'A deep dive into the evolution and comparison of popular frontend frameworks like React, Angular, and Vue.'
  },
  {
    id: '2',
    title: 'Mastering TypeScript for Scalable Applications',
    content: `
TypeScript, a statically typed superset of JavaScript, has taken the development world by storm. By adding types to JavaScript, it helps catch errors early in the development process, improves code readability and maintainability, and provides a superior developer experience with features like autocompletion and code navigation.

This article serves as a comprehensive guide to mastering TypeScript. We'll start with the basics of types, interfaces, and enums, and then move on to more advanced topics like generics, utility types, and decorators. You'll learn how to configure your TypeScript project for optimal performance and type safety, and how to integrate it seamlessly with popular frameworks like React and Node.js.

Whether you're a seasoned JavaScript developer looking to level up your skills or a newcomer to the language, this guide will provide you with the knowledge and best practices needed to build robust and scalable applications with TypeScript.
    `,
    author: 'John Smith',
    date: '2023-10-22',
    imageUrl: 'https://picsum.photos/seed/typescript/800/400',
    excerpt: 'Learn how to leverage TypeScript to build more robust, scalable, and error-free web applications.'
  },
  {
    id: '3',
    title: 'The Art of UI/UX: Creating User-Centric Designs',
    content: `
A visually stunning application is only half the battle; without a thoughtful and intuitive user experience (UX), even the most beautiful user interface (UI) can fall flat. The art of UI/UX design is about understanding your users, anticipating their needs, and creating a seamless and enjoyable journey for them.

In this piece, we explore the fundamental principles of user-centric design. We'll cover topics such as user research, persona creation, wireframing, prototyping, and usability testing. We'll also discuss the importance of accessibility, ensuring that your application is usable by everyone, regardless of their abilities.

Discover how to balance aesthetics with functionality, create clear information architecture, and use visual hierarchy to guide your users' attention. By the end of this read, you'll have a better appreciation for the intricate dance between UI and UX, and be equipped with the principles to create designs that not only look good but feel great to use.
    `,
    author: 'Alex Johnson',
    date: '2023-10-18',
    imageUrl: 'https://picsum.photos/seed/uiux/800/400',
    excerpt: 'An exploration of the core principles of UI/UX design, focusing on creating intuitive and accessible user experiences.'
  }
];