// @flow
import GroupGeneratorImpl from '../group-pairing-generator';
import {createRound, createParticipant} from '../../test-utils';

describe('GroupGenerator', () => {
  test('Zero min & max returns empty list', () => {
    const round = {...createRound(), minPairCount: 0, maxPairCount: 0};
    const generator = new GroupGeneratorImpl(round, []);
    expect(generator.generateGroups()).toEqual([]);
  });

  test('Matches leaders and followers', () => {
    const round = {...createRound(), minPairCount: 1, maxPairCount: 1};
    const participants = createParticipants(2);
    const generator = new GroupGeneratorImpl(round, participants);
    stubRandom(generator);

    expect(generator.generateGroups())
      .toEqual([
        [{leader: participants[0]._id, follower: participants[1]._id}]
      ]);
  });

  test('"Both" may be a follower', () => {
    const round = {...createRound(), minPairCount: 1, maxPairCount: 1};
    const participants = [
      {...createParticipant(), role: 'leader'},
      {...createParticipant(), role: 'both'}
    ];
    const generator = new GroupGeneratorImpl(round, participants);
    stubRandom(generator);

    expect(generator.generateGroups())
      .toEqual([
        [{leader: participants[0]._id, follower: participants[1]._id}]
      ]);
  });

  test('"Both" may be a leader', () => {
    const round = {...createRound(), minPairCount: 1, maxPairCount: 1};
    const participants = [
      {...createParticipant(), role: 'both'},
      {...createParticipant(), role: 'follower'}
    ];
    const generator = new GroupGeneratorImpl(round, participants);
    stubRandom(generator);

    expect(generator.generateGroups())
      .toEqual([
        [{leader: participants[0]._id, follower: participants[1]._id}]
      ]);
  });

  test('Two "both" may match', () => {
    const round = {...createRound(), minPairCount: 1, maxPairCount: 1};
    const participants = [
      {...createParticipant(), role: 'both'},
      {...createParticipant(), role: 'both'}
    ];
    const generator = new GroupGeneratorImpl(round, participants);
    stubRandom(generator);

    expect(generator.generateGroups())
      .toEqual([
        [{leader: participants[0]._id, follower: participants[1]._id}]
      ]);
  });

  test('Creates multiple arrays if all cant fit in one', () => {
    const round = {...createRound(), minPairCount: 1, maxPairCount: 1};
    const participants = createParticipants(4);
    const generator = new GroupGeneratorImpl(round, participants);
    stubRandom(generator);

    expect(generator.generateGroups())
      .toEqual([
        [{leader: participants[0]._id, follower: participants[1]._id}],
        [{leader: participants[2]._id, follower: participants[3]._id}]
      ]);
  });

  test('Only creates as many groups as needed', () => {
    const round = {...createRound(), minPairCount: 1, maxPairCount: 2};
    const participants = createParticipants(4);
    const generator = new GroupGeneratorImpl(round, participants);
    stubRandom(generator);

    expect(generator.generateGroups())
      .toEqual([[
        {leader: participants[0]._id, follower: participants[1]._id},
        {leader: participants[2]._id, follower: participants[3]._id}
      ]]);
  });

  test('Fills the first group first first groups', () => {
    const round = {...createRound(), minPairCount: 1, maxPairCount: 2};
    const participants = createParticipants(6);
    const generator = new GroupGeneratorImpl(round, participants);
    stubRandom(generator);

    expect(generator.generateGroups())
      .toEqual([
        [{leader: participants[0]._id, follower: participants[1]._id},
          {leader: participants[2]._id, follower: participants[3]._id}],
        [{leader: participants[4]._id, follower: participants[5]._id}],
      ]);
  });

  test('Fills at least minPairCount in each group', () => {
    const round = {...createRound(), minPairCount: 2, maxPairCount: 3};
    const participants = createParticipants(8);
    const generator = new GroupGeneratorImpl(round, participants);
    stubRandom(generator);

    expect(generator.generateGroups())
      .toEqual([
        [{leader: participants[0]._id, follower: participants[1]._id},
          {leader: participants[2]._id, follower: participants[3]._id}],
        [{leader: participants[6]._id, follower: participants[7]._id},
          {leader: participants[4]._id, follower: participants[5]._id}],
      ]);
  });

  test('Redistributes equally, from the back', () => {
    const round = {...createRound(), minPairCount: 3, maxPairCount: 4};
    const participants = createParticipants(18);
    const generator = new GroupGeneratorImpl(round, participants);
    stubRandom(generator);

    expect(generator.generateGroups())
      .toEqual([
        [
          {leader: participants[0]._id, follower: participants[1]._id},
          {leader: participants[2]._id, follower: participants[3]._id},
          {leader: participants[4]._id, follower: participants[5]._id},
        ],
        [
          {leader: participants[8]._id, follower: participants[9]._id},
          {leader: participants[10]._id, follower: participants[11]._id},
          {leader: participants[12]._id, follower: participants[13]._id},
        ],
        [
          {leader: participants[16]._id, follower: participants[17]._id},
          {leader: participants[14]._id, follower: participants[15]._id},
          {leader: participants[6]._id, follower: participants[7]._id},
        ],
      ]);
  });

  test('Will redistribute equally if condition cant be upheld', () => {
    const round = {...createRound(), minPairCount: 4, maxPairCount: 4};
    const participants = createParticipants(18);
    const generator = new GroupGeneratorImpl(round, participants);
    stubRandom(generator);

    expect(generator.generateGroups())
      .toEqual([
        [
          {leader: participants[0]._id, follower: participants[1]._id},
          {leader: participants[2]._id, follower: participants[3]._id},
          {leader: participants[4]._id, follower: participants[5]._id},
        ],
        [
          {leader: participants[8]._id, follower: participants[9]._id},
          {leader: participants[10]._id, follower: participants[11]._id},
          {leader: participants[12]._id, follower: participants[13]._id},
        ],
        [
          {leader: participants[16]._id, follower: participants[17]._id},
          {leader: participants[14]._id, follower: participants[15]._id},
          {leader: participants[6]._id, follower: participants[7]._id},
        ],
      ]);
  });
});

function createParticipants(count: number) {
  const participants: Array<Participant> = [];
  for (let i = 0; i < count; ++i) {
    if (i % 2 === 0) {
      participants.push({...createParticipant(), role: 'leader'});
    } else {
      participants.push({...createParticipant(), role: 'follower'});
    }
  }
  return participants;
}

function stubRandom(generator: GroupGeneratorImpl) {
  generator._randomIndex = () => {
    // just pop from front
    return 0;
  };
}
