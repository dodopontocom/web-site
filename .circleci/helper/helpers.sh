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

helper.semver() {

  local version branch build_number

  version=$1
  branch=$2
  build_number=$3

  _string=(${version//./ })
  echo "${_string[@]}"

  if [[ "${branch}" == "master" ]]; then
    ((_string[0]++))
    _string[1]=0
    _string[2]=0
  fi

  if [[ "${branch}" == "develop" ]]; then
    ((_string[1]++))
    _string[2]=0
  fi

  if [[ "${branch}" != "master" ]] || \
      [[ "${branch}" != "develop" ]]; then
    ((_string[2]++))
    if [[ -n ${build_number} ]]; then
      _string[2]="$(echo ${_string[2]}-${branch//\//-}\(build-${build_number}\) | tr '[:upper:]' '[:lower:]')"
    else
      _string[2]="$(echo ${_string[2]}-${branch//\//-} | tr '[:upper:]' '[:lower:]')"
    fi
  fi

  echo "${_string[0]}.${_string[1]}.${_string[2]}"

}