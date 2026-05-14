'use client'

export default function ApplicationCardBlock(props: any) {
  const imageUrl = props.QRImage?.url?.default || ''
  const linkUrl = props.ApplicationLink?.url?.default || ''
  const linkTarget = props.ApplicationLink?.target
  const linkTitle = props.ApplicationLink?.title || 'Open'

  return (
    <div className="registration-block__app-card">
      {imageUrl && (
        <img
          alt={props.Heading || 'Application QR code'}
          className="registration-block__app-qr"
          src={imageUrl}
        />
      )}

      <div className="registration-block__app-content">
        {props.Heading && (
          <h3 className="registration-block__app-title">
            {props.Heading}
          </h3>
        )}

        {props.Description && (
          <p className="registration-block__app-text">
            {props.Description}
          </p>
        )}

        {linkUrl && (
          <button
            className="btn btn--primary btn--lg btn--icon-right registration-block__open-next"
            type="button"
            onClick={() => window.open(linkUrl, linkTarget)}
          >
            <span className="btn__label">{linkTitle}</span>
          </button>
        )}
      </div>
    </div>
  )
}