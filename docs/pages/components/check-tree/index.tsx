import React, { useState } from 'react';
import { CheckTree, Toggle, Icon } from 'rsuite';
import DefaultPage from '@/components/Page';
import useFetchData from '@/utils/useFetchData';

export default function Page() {
  const { response: data } = useFetchData('city-simplified');
  return <DefaultPage dependencies={{ data, CheckTree, Toggle, Icon, useState }} />;
}
