import styled, { css } from "styled-components";
import { theme } from "@/styles/themes";

export const ButtonStyle = css`
  border: 0;
  padding: 5px 15px;
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  svg {
    height: 16px;
    margin-right: 5px; 
  };

  ${props => props.$primary && css`
    background-color: ${({ theme }) => theme.colors.buttonPrimary};
    color: ${({ theme }) => theme.colors.white};

    &:hover {
      background-color: ${({ theme }) => theme.colors.buttonHover};
    }
  `}

  ${props => props.$border && css`
    border: 1px solid ${({ theme }) => theme.colors.border};
  `}

  ${props => props.$size === 'l' && css`
    font-size: 1.2rem;
    padding: 10px 20px;
    svg {
      height: 20px;
    };
  `}

`

const StyledButtton = styled.button`
  ${ButtonStyle}
`;

export default function Button({children, ...rest}) {
  return (
    <StyledButtton {...rest}>{children}</StyledButtton>
  );
}
