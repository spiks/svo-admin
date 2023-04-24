import React, { FC, useContext } from 'react';
import { CvSection } from '@components/Cv/Cv.children/CvSection.component';
import { CvSubTitle } from '@components/Cv/Cv.children/CvSubTitle.component';
import styles from '../Cv.module.css';
import { CvContext } from '@components/Cv/Cv.component';

export const Links: FC = () => {
  const query = useContext(CvContext);
  const socialLinks = query.data?.socialLinks;
  const presentation = query.data?.presentation;

  return (
    <CvSection title={'Ссылки'}>
      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }}>
        {presentation && (
          <>
            <CvSubTitle>Видеовизитка</CvSubTitle>
            <a className={styles['link']} href={presentation.url} target={'_blank'} rel={'noreferrer'}>
              {presentation.url}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
        {socialLinks?.vkLink && (
          <>
            <CvSubTitle>ВКонтакте</CvSubTitle>
            <a className={styles['link']} href={socialLinks.vkLink} target={'_blank'} rel={'noreferrer'}>
              {socialLinks.vkLink}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
        {socialLinks?.facebookLink && (
          <>
            <CvSubTitle>Facebook</CvSubTitle>
            <a className={styles['link']} href={socialLinks.facebookLink} target={'_blank'} rel={'noreferrer'}>
              {socialLinks.facebookLink}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
        {socialLinks?.telegramLink && (
          <>
            <CvSubTitle>Telegram</CvSubTitle>
            <a className={styles['link']} href={socialLinks.telegramLink} target={'_blank'} rel={'noreferrer'}>
              {socialLinks.telegramLink}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
        {socialLinks?.instagramLink && (
          <>
            <CvSubTitle>Instagram</CvSubTitle>
            <a className={styles['link']} href={socialLinks.instagramLink} target={'_blank'} rel={'noreferrer'}>
              {socialLinks.instagramLink}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
        {socialLinks?.twitterLink && (
          <>
            <CvSubTitle>Twitter</CvSubTitle>
            <a className={styles['link']} href={socialLinks.twitterLink} target={'_blank'} rel={'noreferrer'}>
              {socialLinks.twitterLink}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
        {socialLinks?.youtubeLink && (
          <>
            <CvSubTitle>YouTube</CvSubTitle>
            <a className={styles['link']} href={socialLinks.youtubeLink} target={'_blank'} rel={'noreferrer'}>
              {socialLinks.youtubeLink}
            </a>
            <div style={{ height: '8px' }} />
          </>
        )}
      </div>
    </CvSection>
  );
};
