export interface BungieUserProfile {
	about: string;
	cachedBungieGlobalDisplayName: string;
	cachedBungieGlobalDisplayNameCode: number;
	context: {
		isFollowing: boolean;
		ignoreStatus: {
			isIgnored: boolean;
			ignoreFlags: number;
		};
	};
	displayName: string;
	firstAccess: string;
	isDeleted: boolean;
	lastUpdate: string;
	locale: string;
	localeInheritDefault: boolean;
	membershipId: string;
	profilePicture: number;
	profilePicturePath: string;
	profileTheme: number;
	profileThemeName: string;
	psnDisplayName: string;
	showActivity: boolean;
	showGroupMessaging: boolean;
	statusDate: string;
	statusText: string;
	steamDisplayName: string;
	successMessageFlags: string;
	twitchDisplayName: string;
	uniqueName: string;
	userTitle: number;
	userTitleDisplay: string;
}
