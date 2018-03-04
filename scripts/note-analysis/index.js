const fs = require('fs');
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

// SET ME
const tournamentId = '5a998eee78582b402499c647';

let db;
let tournament;
MongoClient.connect('mongodb://localhost')
  .then(client => {
    db = client.db('4temps');

    return db
      .collection('tournaments')
      .findOne({ _id: mongodb.ObjectId(tournamentId) });
  })
  .then(result => {
    tournament = result;
    return db.collection('submittednotes').find({});
  })
  .then(notes => notes.toArray())
  .then(notes => {
    return tournament.judges.reduce((tournamentNotes, judge) => {
      return tournamentNotes.concat(
        notes.filter(note => note.judgeId == judge._id.toString())
      );
    }, []);
  })
  .then(notes => {
    const participants = tournament.participants.reduce((acc, par) => {
      acc[par._id] = par;
      return acc;
    }, {});
    const judgeToIndex = tournament.judges.reduce((acc, judge, i) => {
      acc[judge._id.toString()] = i;
      return acc;
    }, {});
    const danceToRound = tournament.rounds.reduce((acc, round) => {
      const dances = getDancesOfRound(round);
      return Object.assign(
        acc,
        dances.reduce((danceToRound, id) => {
          danceToRound[id] = round;
          return danceToRound;
        }, {})
      );
    }, {});
    const criteria = tournament.rounds.reduce((acc, round) => {
      return Object.assign(
        acc,
        round.criteria.reduce((acc, crit) => {
          acc[crit._id] = crit;
          return acc;
        }, {})
      );
    }, {});

    return notes.map(note => {
      return {
        participantName: participants[note.participantId].name,
        participantAttendanceId: participants[note.participantId].attendanceId,
        criterion: criteria[note.criterionId].name,
        judge: judgeToIndex[note.judgeId],
        round: danceToRound[note.danceId].name,
        value: note.value
      };
    });
  })
  .then(rows => {
    return rows.reduce((str, row) => {
      return str.concat(Object.values(row).join(), '\n');
    }, 'Name,ID,Criterion,Judge,Round,Value\n');
  })
  .then(out => {
    return new Promise((resolve, reject) => {
      fs.writeFile('output.csv', out, err => {
        if (err) reject(err);
        resolve();
      });
    });
  })
  .then(() => {
    console.log('Wrote output to "output.csv"');
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

function getDancesOfRound(round) {
  return round.groups.reduce((dances, group) => {
    return dances.concat(group.dances.map(({ _id }) => _id));
  }, []);
}
