#!/usr/bin/env bash
#
#
#Function will get directories and files that had been changed from the last push
helper.gitDirChanges() {
  changed_folders=($(git diff --name-status HEAD~1 | awk '{print $2}'))
  #changed_folders=($(git diff --dirstat=files,0 HEAD~1 | awk '{print $2}'))
  for f in "${changed_folders[@]}"; do
      if [[ "$(echo ${changed_folders[@]} | grep -o ${f})" ]]; then
          echo "----- ${f}"
      fi
  done
}

helper.another() {
  echo another_one
}

helper.npm_version() {

  local branch directory

  branch=$1
  directory=$2

  if [[ "${branch}" == "master" ]]; then
    npm version major --prefix ${directory}
  fi

  if [[ "${branch}" == "develop" ]]; then
    npm version minor --prefix ${directory}
  fi

  if [[ "${branch}" != "master" ]] || \
      [[ "${branch}" != "develop" ]]; then
    npm version patch --prefix ${directory}
  fi
}