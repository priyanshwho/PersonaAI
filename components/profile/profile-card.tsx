'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ProfileCard({ children, className, ...props }: ProfileCardProps) {
  return (
    <div
      className={twMerge(
        'group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-muted-foreground/30 transition-all duration-300 relative focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background outline-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface ProfileCardAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function ProfileCardAvatar({ src, alt, className, ...props }: ProfileCardAvatarProps) {
  return (
    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border mb-4 bg-muted flex items-center justify-center shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={twMerge('w-full h-full object-cover select-none', className)}
        loading="lazy"
        {...props}
      />
    </div>
  );
}

interface ProfileCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ProfileCardHeader({ children, className, ...props }: ProfileCardHeaderProps) {
  return (
    <div className={twMerge('flex flex-col space-y-1 mb-2', className)} {...props}>
      {children}
    </div>
  );
}

interface ProfileCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function ProfileCardTitle({ children, className, ...props }: ProfileCardTitleProps) {
  return (
    <h3
      className={twMerge(
        'text-lg font-bold tracking-tight text-foreground text-wrap balance',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

interface ProfileCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function ProfileCardDescription({ children, className, ...props }: ProfileCardDescriptionProps) {
  return (
    <p
      className={twMerge('text-sm text-muted-foreground font-medium', className)}
      {...props}
    >
      {children}
    </p>
  );
}

interface ProfileCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ProfileCardContent({ children, className, ...props }: ProfileCardContentProps) {
  return (
    <div
      className={twMerge('text-sm text-muted-foreground flex-1 mb-4 leading-relaxed break-words', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface ProfileCardTagsProps extends React.HTMLAttributes<HTMLDivElement> {
  tags: string[];
}

export function ProfileCardTags({ tags, className, ...props }: ProfileCardTagsProps) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className={twMerge('flex flex-wrap gap-1.5 mb-4', className)} {...props}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold border border-border/50 select-none"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

interface ProfileCardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ProfileCardActions({ children, className, ...props }: ProfileCardActionsProps) {
  return (
    <div
      className={twMerge('flex items-center gap-2 mt-auto w-full', className)}
      {...props}
    >
      {children}
    </div>
  );
}
