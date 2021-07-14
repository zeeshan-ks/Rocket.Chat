import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { LivechatRooms, Users, LivechatVisitors } from '../../../models';
import { Livechat } from '../lib/Livechat';

Meteor.methods({
	async 'livechat:getNextAgent'({ token, department }) {
		check(token, String);

		const room = LivechatRooms.findOpenByVisitorToken(token).fetch();

		if (room && room.length > 0) {
			return;
		}

		if (!department) {
			const requireDeparment = Livechat.getRequiredDepartment();
			if (requireDeparment) {
				department = requireDeparment._id;
			}
		}

		const visitor = LivechatVisitors.getVisitorByToken(token);
		const agent = await Livechat.getNextAgent(department, undefined, visitor);
		if (!agent) {
			return;
		}

		return Users.getAgentInfo(agent.agentId);
	},
});
