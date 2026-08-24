import { services } from "../data/services";
import type { Service } from "../data/services";
import { portfolio } from "../data/portfolio";
import type { PortfolioProject } from "../data/portfolio";
import { creators } from "../data/creators";
import type { Creator } from "../data/creators";
import { blog } from "../data/blog";
import type { BlogPost } from "../data/blog";
import { teamMembers } from "../data/team";
import type { TeamMember } from "../data/team";
import { partners } from "../data/partners";
import type { Partner } from "../data/partners";

// Simulated delay helper for realistic loading states
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  // Services
  async getServices(): Promise<Service[]> {
    await delay(100);
    return [...services];
  },
  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    await delay(100);
    return services.find((s) => s.slug === slug);
  },

  // Portfolio
  async getPortfolioProjects(category?: string): Promise<PortfolioProject[]> {
    await delay(100);
    if (!category || category === "Todos") {
      return [...portfolio];
    }
    return portfolio.filter((p) => p.categoria.toLowerCase() === category.toLowerCase());
  },
  async getFeaturedPortfolio(): Promise<PortfolioProject[]> {
    await delay(100);
    return portfolio.filter((p) => p.destaqueHome);
  },
  async getProjectBySlug(slug: string): Promise<PortfolioProject | undefined> {
    await delay(100);
    return portfolio.find((p) => p.slug === slug);
  },

  // Creators
  async getCreators(category?: string): Promise<Creator[]> {
    await delay(100);
    if (!category || category === "Todos") {
      return [...creators];
    }
    return creators.filter((c) => c.category.toLowerCase() === category.toLowerCase());
  },
  async getCreatorBySlug(slug: string): Promise<Creator | undefined> {
    await delay(100);
    return creators.find((c) => c.slug === slug);
  },

  // Blog
  async getBlogPosts(category?: string): Promise<BlogPost[]> {
    await delay(100);
    if (!category || category === "Todos") {
      return [...blog];
    }
    return blog.filter((b) => b.categoria.toLowerCase() === category.toLowerCase());
  },
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    await delay(100);
    return blog.find((b) => b.slug === slug);
  },

  // Team & Clients
  async getTeam(): Promise<TeamMember[]> {
    await delay(100);
    return [...teamMembers];
  },
  async getPartners(): Promise<Partner[]> {
    await delay(100);
    return [...partners];
  },
};
