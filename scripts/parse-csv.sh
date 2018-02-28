#!/usr/bin/env bash

# USAGE
# ./parse-csv.sh [FILENAME]
# example: ./parse-csv.sh example.csv
#
# The csv file should only be a list of name,role
# NO SPACING after the comma
#
# Example:
# Simon Kindstrom,leader
# Margot Brunet,follower
# Fred Something,leaderAndFollower
# Sam Halali,follower

# Set this to whatever your session variable is of the ADMIN
COOKIE=SESSION=s%3AkelBq1JarmD-ZGMUoVcxqB86KiAGHY81.HBjC7LKtFqBYkkaor57r%2BT0Wsi6ov%2B8zCrPKI48y3JY

LOCATION=http://localhost:3000
#LOCATION=https://4temps.simonkindstrom.com

# Whatever is in the URL when you're editing your tournament
TOURNAMENT_ID=5a93019db9b2ad352a53c2af

while read p || [[ -n "$p" ]] ; do
  name=$(echo $p | cut -d, -f1)
  role=$(echo $p | cut -d, -f2)

  if [[ -z "$name" ]]; then
    echo "Row $p has empty name"
    exit 1
  fi

  if ! { [ "$role" == "leader" ] || [ "$role" == "follower" ] || [ "$role" == "leaderAndFollower" ]; }; then
    echo "Row $p has invalid role:"
    exit 2
  fi

  json='{"tournamentId":"'${TOURNAMENT_ID}'","participant":{"id":"","name":"'"${name}"'","role":"'${role}'","attendanceId":0,"isAttending":false}}'

  status=$(curl "${LOCATION}/api/participant/${TOURNAMENT_ID}/create" -H 'Content-Type: application/json' -H "Cookie: ${COOKIE}" -X POST --data-binary "$json" --compressed -s -o /dev/null -w "%{http_code}")

  if [ $status -ne 200 ]; then
    echo "Server returned $status, exiting"
    exit 4
  fi

  if [ $? -ne 0 ]; then
    echo "Failed adding participant: $p"
    echo "Stopping"
    exit 3
  fi

  echo "Added $p"

done < $1 
