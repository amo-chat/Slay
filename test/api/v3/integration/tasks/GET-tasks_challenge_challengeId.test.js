import {each} from 'lodash';
import {v4 as generateUUID} from 'uuid';
import {generateChallenge, generateGroup, generateUser, translate as t,} from '../../../../helpers/api-integration/v3';

describe('GET /tasks/:taskId', () => {
  let user;
  let guild;
  let challenge;
  let task;
  const tasksToTest = {
    habit: {
      text: 'test habit',
      type: 'habit',
      up: false,
      down: true,
    },
    todo: {
      text: 'test todo',
      type: 'todo',
    },
    daily: {
      text: 'test daily',
      type: 'daily',
      frequency: 'daily',
      everyX: 5,
      startDate: new Date(),
    },
    reward: {
      text: 'test reward',
      type: 'reward',
    },
  };

  before(async () => {
    user = await generateUser();
    guild = await generateGroup(user);
    challenge = await generateChallenge(user, guild);
    await user.post(`/challenges/${challenge._id}/join`);
  });

  it('returns error when incorrect id is passed', async () => {
    await expect(user.get(`/tasks/${generateUUID()}`)).to.eventually.be.rejected.and.eql({
      code: 404,
      error: 'NotFound',
      message: t('messageTaskNotFound'),
    });
  });

  each(tasksToTest, (taskValue, taskType) => {
    context(`${taskType}`, () => {
      before(async () => {
        task = await user.post(`/tasks/challenge/${challenge._id}`, taskValue);
      });

      it('gets challenge task', async () => {
        const getTask = await user.get(`/tasks/${task._id}`);
        expect(getTask).to.eql(task);
      });

      it('returns error when user is not a member of the challenge', async () => {
        const anotherUser = await generateUser();

        await expect(anotherUser.get(`/tasks/${task._id}`)).to.eventually.be.rejected.and.eql({
          code: 404,
          error: 'NotFound',
          message: t('messageTaskNotFound'),
        });
      });
    });
  });
});
