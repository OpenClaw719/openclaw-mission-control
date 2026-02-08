import { mutation } from "./_generated/server";

const DEFAULT_TENANT_ID = "default";

export const clearAndSetup = mutation({
	args: {},
	handler: async (ctx) => {
		// Clear ALL existing data
		const agents = await ctx.db.query("agents").collect();
		for (const agent of agents) {
			await ctx.db.delete(agent._id);
		}
		
		const tasks = await ctx.db.query("tasks").collect();
		for (const task of tasks) {
			await ctx.db.delete(task._id);
		}
		
		const messages = await ctx.db.query("messages").collect();
		for (const msg of messages) {
			await ctx.db.delete(msg._id);
		}
		
		const activities = await ctx.db.query("activities").collect();
		for (const activity of activities) {
			await ctx.db.delete(activity._id);
		}
		
		const documents = await ctx.db.query("documents").collect();
		for (const doc of documents) {
			await ctx.db.delete(doc._id);
		}
		
		// Create OpenClaw Agent
		const openclawAgent = await ctx.db.insert("agents", {
			name: "OpenClaw",
			role: "AI Developer",
			level: "LEAD",
			status: "active",
			avatar: "🦞",
			systemPrompt: "Full-stack AI developer with access to Anthropic Claude Sonnet 4. Handles code generation, debugging, testing, and deployment.",
			character: "Methodical, detail-oriented, and highly capable. Communicates progress clearly and asks for clarification when needed.",
			lore: "Your personal AI development assistant running on your secure infrastructure.",
			tenantId: DEFAULT_TENANT_ID,
		});
		
		// Create first project: Automated Platform
		const projectTaskId = await ctx.db.insert("tasks", {
			title: "Automated Platform Development",
			description: "Main project for the automated trading/finance platform. Track all related tasks here.",
			status: "in_progress",
			assigneeIds: [openclawAgent],
			tags: ["project", "trading", "automation"],
			tenantId: DEFAULT_TENANT_ID,
		});
		
		// Create example tasks
		await ctx.db.insert("tasks", {
			title: "Setup GitHub integration",
			description: "Ensure OpenClaw has proper access to trading-platform repository with read/write permissions.",
			status: "done",
			assigneeIds: [openclawAgent],
			tags: ["github", "setup"],
			tenantId: DEFAULT_TENANT_ID,
		});
		
		await ctx.db.insert("tasks", {
			title: "Review current codebase structure",
			description: "Analyze the automated-platform codebase and document current architecture.",
			status: "todo",
			assigneeIds: [openclawAgent],
			tags: ["analysis", "documentation"],
			tenantId: DEFAULT_TENANT_ID,
		});
		
		await ctx.db.insert("tasks", {
			title: "Plan next development phase",
			description: "Define the next set of features to implement for the trading platform.",
			status: "todo",
			assigneeIds: [],
			tags: ["planning"],
			tenantId: DEFAULT_TENANT_ID,
		});
		
		// Add welcome activity
		await ctx.db.insert("activities", {
			type: "status_update",
			agentId: openclawAgent,
			message: "Mission Control is ready for action! 🚀",
			tenantId: DEFAULT_TENANT_ID,
		});
		
		return { success: true, message: "Mission Control setup complete!" };
	},
});
